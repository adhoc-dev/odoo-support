function get_open_user() {

    var instance = openerp;

    instance.web.Notification =  instance.web.Widget.extend({

        // antes pasabamos el database uuid, ahora pasamos el de user
        init: function() {
            var func = new instance.web.Model("res.users").get_func("read");
            var func_contract_r = new instance.web.Model("support.contract").get_func("read");
            var func_contract = new instance.web.Model("support.contract").get_func("get_active_contract_id");

            var talkus_img;
            var talkus_id;

            /*Get the id of talkus*/
            func_contract().then(function(resc) {
                if(resc)
                    self.talkus_id = resc;
            });
            /*Get the small image of talkus*/
            if(self.talkus_id){
                 func_contract_r(self.talkus_id, ["talkus_image_small","id"]).then(function(resc) {
                    if(resc.talkus_image_small)
                        self.talkus_img = instance.session.url('/web/binary/image', {model:'support.contract', field: 'talkus_image_small', id: resc.id});
                    });
                }

            func(instance.session.uid, ["name",  "remote_partner_uuid", "email", "image_small"]).then(function(res) {
                if (res){
                    if (!res.remote_partner_uuid){
                        return;
                    }
                    (function(t,a,l,k,u,s,_){if(!t[u]){t[u]=function(){(t[u].q=t[u].q||[]).push(arguments)},t[u].l=1*new Date();s=a.createElement(l),_=a.getElementsByTagName(l)[0];s.async=1;s.src=k;_.parentNode.insertBefore(s,_)}})(window,document,'script','//www.talkus.io/plugin.js','talkus');
                    // TODO make this two parameters db parameters

                    if (self.talkus_img)
                        talkus('loadingImage', self.talkus_img);
                    talkus('create', self.talkus_id);
                    if(res.image_small)
                        user_img = instance.session.url('/web/binary/image', {model:'res.user', field: 'image_small', id: res.id});
                    else
                        user_img = "";
                    talkus('identify', { id: res.remote_partner_uuid, name: res.name, email: res.email, picture: user_img});
                }

            });
        }
    });

    var widget = new instance.web.Notification();


}

get_open_user();