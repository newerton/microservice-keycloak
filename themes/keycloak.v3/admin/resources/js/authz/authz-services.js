module.factory("ResourceServer",(function(e){return e(authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server",{realm:"@realm",client:"@client"},{update:{method:"PUT"},import:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/import",method:"POST"},settings:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/settings",method:"GET"}})})),module.factory("ResourceServerResource",(function(e){return e(authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/resource/:rsrid",{realm:"@realm",client:"@client",rsrid:"@rsrid"},{update:{method:"PUT"},search:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/resource/search",method:"GET"},scopes:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/resource/:rsrid/scopes",method:"GET",isArray:!0},permissions:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/resource/:rsrid/permissions",method:"GET",isArray:!0}})})),module.factory("ResourceServerScope",(function(e){return e(authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/scope/:id",{realm:"@realm",client:"@client",id:"@id"},{update:{method:"PUT"},search:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/scope/search",method:"GET"},resources:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/scope/:id/resources",method:"GET",isArray:!0},permissions:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/scope/:id/permissions",method:"GET",isArray:!0}})})),module.factory("ResourceServerPolicy",(function(e){return e(authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/:type/:id",{realm:"@realm",client:"@client",id:"@id",type:"@type"},{update:{method:"PUT"},search:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/search",method:"GET"},associatedPolicies:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/:id/associatedPolicies",method:"GET",isArray:!0},dependentPolicies:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/:id/dependentPolicies",method:"GET",isArray:!0},scopes:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/:id/scopes",method:"GET",isArray:!0},resources:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/:id/resources",method:"GET",isArray:!0}})})),module.factory("ResourceServerPermission",(function(e){return e(authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/permission/:type/:id",{realm:"@realm",client:"@client",type:"@type",id:"@id"},{update:{method:"PUT"},search:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/permission/search",method:"GET"},searchPolicies:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy",method:"GET",isArray:!0},associatedPolicies:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/:id/associatedPolicies",method:"GET",isArray:!0},dependentPolicies:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/:id/dependentPolicies",method:"GET",isArray:!0},scopes:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/permission/:id/scopes",method:"GET",isArray:!0},resources:{url:authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/permission/:id/resources",method:"GET",isArray:!0}})})),module.factory("PolicyProvider",(function(e){return e(authUrl+"/admin/realms/:realm/clients/:client/authz/resource-server/policy/providers",{realm:"@realm",client:"@client"})})),module.service("AuthzDialog",(function(e){var r={},t=function(r,t,s,l){return e.open({templateUrl:resourceUrl+l,controller:function(e,r,t,s,l,a){e.title=s,e.message=t.trustAsHtml(l),e.btns=a,e.ok=function(){r.close()},e.cancel=function(){r.dismiss("cancel")}},resolve:{title:function(){return r},message:function(){return t},btns:function(){return s}}}).result};return r.confirmDeleteWithMsg=function(e,r,s,l){t("Delete "+r,s+="Are you sure you want to permanently delete the "+r+" <strong>"+e+"</strong> ?",{ok:{label:"Delete",cssClass:"btn btn-danger"},cancel:{label:"Cancel",cssClass:"btn btn-default"}},"/templates/authz/kc-authz-modal.html").then(l)},r.confirmDelete=function(e,r,s){t("Delete "+r,"Are you sure you want to permanently delete the "+r+" <strong>"+e+"</strong> ?",{ok:{label:"Delete",cssClass:"btn btn-danger"},cancel:{label:"Cancel",cssClass:"btn btn-default"}},"/templates/authz/kc-authz-modal.html").then(s)},r})),module.factory("RoleManagementPermissions",(function(e){return e(authUrl+"/admin/realms/:realm/roles-by-id/:role/management/permissions",{realm:"@realm",role:"@role"},{update:{method:"PUT"}})})),module.factory("UsersManagementPermissions",(function(e){return e(authUrl+"/admin/realms/:realm/users-management-permissions",{realm:"@realm"},{update:{method:"PUT"}})})),module.factory("ClientManagementPermissions",(function(e){return e(authUrl+"/admin/realms/:realm/clients/:client/management/permissions",{realm:"@realm",client:"@client"},{update:{method:"PUT"}})})),module.factory("IdentityProviderManagementPermissions",(function(e){return e(authUrl+"/admin/realms/:realm/identity-provider/instances/:alias/management/permissions",{realm:"@realm",alias:"@alias"},{update:{method:"PUT"}})})),module.factory("GroupManagementPermissions",(function(e){return e(authUrl+"/admin/realms/:realm/groups/:group/management/permissions",{realm:"@realm",group:"@group"},{update:{method:"PUT"}})})),module.factory("policyViewState",[function(){return{model:{state:{}}}}]),module.factory("viewState",[function(){return{model:{state:{}}}}]);