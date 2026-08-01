var resourceBundle,
  auth = {},
  locale = 'en',
  module = angular.module('keycloak', [
    'keycloak.services',
    'keycloak.loaders',
    'ui.bootstrap',
    'ui.select2',
    'angularFileUpload',
    'angularTreeview',
    'pascalprecht.translate',
    'ngCookies',
    'ngSanitize',
    'ui.ace',
  ]),
  resourceRequests = 0,
  loadingTimer = -1,
  _translateProvider = null,
  _currentRealm = null;
angular.element(document).ready(() => {
  var e = new Keycloak(`${consoleBaseUrl}config`);
  function r(r, t) {
    var n = new XMLHttpRequest();
    n.open('GET', `${consoleBaseUrl}whoami`, !0),
      n.setRequestHeader('Accept', 'application/json'),
      n.setRequestHeader('Authorization', `bearer ${e.token}`),
      (n.onreadystatechange = () => {
        if (4 === n.readyState)
          if (200 === n.status) {
            var e = JSON.parse(n.responseText);
            r(e);
          } else t();
      }),
      n.send();
  }
  function t(e) {
    return e?.realm_access;
  }
  (e.onAuthLogout = () => {
    location.reload();
  }),
    (auth.refreshPermissions = (e, n) => {
      r(
        (r) => {
          (auth.user = r),
            (auth.loggedIn = !0),
            (auth.hasAnyAccess = t(r)),
            e();
        },
        () => {
          n();
        },
      );
    }),
    module.factory('Auth', () => auth),
    e
      .init({ onLoad: 'login-required', pkceMethod: 'S256' })
      .then(() => {
        (auth.authz = e),
          r((e) => {
            (auth.user = e),
              (auth.loggedIn = !0),
              (auth.hasAnyAccess = t(e)),
              (locale = auth.user.locale || locale),
              ((e, r) => {
                var t = new XMLHttpRequest();
                t.open(
                  'GET',
                  `${consoleBaseUrl}messages.json?lang=${locale}`,
                  !0,
                ),
                  t.setRequestHeader('Accept', 'application/json'),
                  (t.onreadystatechange = () => {
                    if (4 === t.readyState)
                      if (200 === t.status) {
                        var n = JSON.parse(t.responseText);
                        e?.(n);
                      } else r?.();
                  }),
                  t.send();
              })((e) => {
                (resourceBundle = e),
                  angular
                    .bootstrap(document, ['keycloak'])
                    .get('$translate')('consoleTitle')
                    .then((e) => {
                      document.title = e;
                    });
              });
          }),
          (() => {
            if (
              -1 !==
              [
                'ar',
                'az',
                'bg',
                'ca',
                'cs',
                'da',
                'de',
                'el',
                'es',
                'et',
                'eu',
                'fa',
                'fi',
                'fr',
                'gl',
                'he',
                'hr',
                'hu',
                'id',
                'is',
                'it',
                'ja',
                'ka',
                'ko',
                'lt',
                'lv',
                'mk',
                'ms',
                'nl',
                'no',
                'pl',
                'pt-BR',
                'pt-PT',
                'ro',
                'rs',
                'ru',
                'sk',
                'sv',
                'th',
                'tr',
                'ug-CN',
                'uk',
                'vi',
                'zh-CN',
                'zh-TW',
              ].indexOf(locale)
            ) {
              for (
                var e,
                  r = document.getElementsByTagName('script'),
                  t = 0,
                  n = r.length;
                t < n;
                t++
              ) {
                var l = r[t].getAttribute('src');
                if (l?.match(/\/select2\/select2\.js$/)) {
                  e = l;
                  break;
                }
              }
              if (e) {
                var o = document.createElement('script');
                (o.src = e.replace(
                  /\/select2\/select2\.js$/,
                  `/select2/select2_locale_${locale}.js`,
                )),
                  (o.type = 'text/javascript'),
                  document.getElementsByTagName('head')[0].appendChild(o);
              }
            }
          })();
      })
      .catch(() => {
        window.location.reload();
      });
}),
  module.factory('authInterceptor', (e, r) => ({
    request: (t) => {
      if (t.url.match(/.html$/)) return t;
      var n = e.defer();
      return (
        r.authz.token &&
          r.authz
            .updateToken(5)
            .then(() => {
              (t.headers = t.headers || {}),
                (t.headers.Authorization = `Bearer ${r.authz.token}`),
                n.resolve(t);
            })
            .catch(() => {
              location.reload();
            }),
        n.promise
      );
    },
  })),
  module.config([
    '$translateProvider',
    (e) => {
      (_translateProvider = e),
        e.useSanitizeValueStrategy('sanitizeParameters'),
        e.preferredLanguage(locale),
        e.translations(locale, resourceBundle);
    },
  ]),
  module.config([
    '$locationProvider',
    (e) => {
      e.hashPrefix('');
    },
  ]),
  module.config([
    '$routeProvider',
    (e) => {
      e.when('/create/realm', {
        templateUrl: `${resourceUrl}/partials/realm-create.html`,
        resolve: {},
        controller: 'RealmCreateCtrl',
      })
        .when('/realms/:realm', {
          templateUrl: `${resourceUrl}/partials/realm-detail.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmDetailCtrl',
        })
        .when('/realms/:realm/localization', {
          templateUrl: `${resourceUrl}/partials/realm-localization.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            realmSpecificLocales: (e) => e(),
          },
          controller: 'RealmLocalizationCtrl',
        })
        .when('/realms/:realm/localization/upload', {
          templateUrl: `${resourceUrl}/partials/realm-localization-upload.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmLocalizationUploadCtrl',
        })
        .when('/realms/:realm/login-settings', {
          templateUrl: `${resourceUrl}/partials/realm-login-settings.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e.delay },
          controller: 'RealmLoginSettingsCtrl',
        })
        .when('/realms/:realm/theme-settings', {
          templateUrl: `${resourceUrl}/partials/realm-theme-settings.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmThemeCtrl',
        })
        .when('/realms/:realm/cache-settings', {
          templateUrl: `${resourceUrl}/partials/realm-cache-settings.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmCacheCtrl',
        })
        .when('/realms', {
          templateUrl: `${resourceUrl}/partials/realm-list.html`,
          controller: 'RealmListCtrl',
        })
        .when('/realms/:realm/token-settings', {
          templateUrl: `${resourceUrl}/partials/realm-tokens.html`,
          resolve: { serverInfo: (e) => e(), realm: (e) => e() },
          controller: 'RealmTokenDetailCtrl',
        })
        .when('/realms/:realm/client-registration/client-initial-access', {
          templateUrl: `${resourceUrl}/partials/client-initial-access.html`,
          resolve: { realm: (e) => e(), clientInitialAccess: (e) => e() },
          controller: 'ClientInitialAccessCtrl',
        })
        .when(
          '/realms/:realm/client-registration/client-initial-access/create',
          {
            templateUrl: `${resourceUrl}/partials/client-initial-access-create.html`,
            resolve: { realm: (e) => e() },
            controller: 'ClientInitialAccessCreateCtrl',
          },
        )
        .when('/realms/:realm/client-registration/client-reg-policies', {
          templateUrl: `${resourceUrl}/partials/client-reg-policies.html`,
          resolve: {
            realm: (e) => e(),
            policies: (e) =>
              e.loadComponents(
                null,
                'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy',
              ),
            clientRegistrationPolicyProviders: (e) => e(),
          },
          controller: 'ClientRegPoliciesCtrl',
        })
        .when(
          '/realms/:realm/client-registration/client-reg-policies/create/:componentType/:providerId',
          {
            templateUrl: `${resourceUrl}/partials/client-reg-policy-detail.html`,
            resolve: {
              realm: (e) => e(),
              instance: (e) => ({
                providerType:
                  'org.keycloak.services.clientregistration.policy.ClientRegistrationPolicy',
                subType: e.current.params.componentType,
                providerId: e.current.params.providerId,
              }),
              clientRegistrationPolicyProviders: (e) => e(),
            },
            controller: 'ClientRegPolicyDetailCtrl',
          },
        )
        .when(
          '/realms/:realm/client-registration/client-reg-policies/:provider/:componentId',
          {
            templateUrl: `${resourceUrl}/partials/client-reg-policy-detail.html`,
            resolve: {
              realm: (e) => e(),
              instance: (e) => e(),
              clientRegistrationPolicyProviders: (e) => e(),
            },
            controller: 'ClientRegPolicyDetailCtrl',
          },
        )
        .when('/realms/:realm/keys', {
          templateUrl: `${resourceUrl}/partials/realm-keys.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            keys: (e) => e(),
          },
          controller: 'RealmKeysCtrl',
        })
        .when('/realms/:realm/keys/passive', {
          templateUrl: `${resourceUrl}/partials/realm-keys-passive.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            keys: (e) => e(),
          },
          controller: 'RealmKeysCtrl',
        })
        .when('/realms/:realm/keys/disabled', {
          templateUrl: `${resourceUrl}/partials/realm-keys-disabled.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            keys: (e) => e(),
          },
          controller: 'RealmKeysCtrl',
        })
        .when('/realms/:realm/keys/providers', {
          templateUrl: `${resourceUrl}/partials/realm-keys-providers.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmKeysProvidersCtrl',
        })
        .when('/create/keys/:realm/providers/:provider', {
          templateUrl: `${resourceUrl}/partials/realm-keys-generic.html`,
          resolve: {
            realm: (e) => e(),
            instance: () => ({}),
            providerId: (e) => e.current.params.provider,
            serverInfo: (e) => e(),
          },
          controller: 'GenericKeystoreCtrl',
        })
        .when('/realms/:realm/keys/providers/:provider/:componentId', {
          templateUrl: `${resourceUrl}/partials/realm-keys-generic.html`,
          resolve: {
            realm: (e) => e(),
            instance: (e) => e(),
            providerId: (e) => e.current.params.provider,
            serverInfo: (e) => e(),
          },
          controller: 'GenericKeystoreCtrl',
        })
        .when('/realms/:realm/identity-provider-settings', {
          templateUrl: `${resourceUrl}/partials/realm-identity-provider.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            instance: (_e) => ({}),
            providerFactory: (_e) => ({}),
            authFlows: (_e) => ({}),
          },
          controller: 'RealmIdentityProviderCtrl',
        })
        .when('/create/identity-provider/:realm/:provider_id', {
          templateUrl: (e) =>
            `${resourceUrl}/partials/realm-identity-provider-${e.provider_id}.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            instance: (_e) => ({}),
            providerFactory: (e) => new e(),
            authFlows: (e) => e(),
          },
          controller: 'RealmIdentityProviderCtrl',
        })
        .when(
          '/realms/:realm/identity-provider-settings/provider/:provider_id/:alias',
          {
            templateUrl: (e) =>
              `${resourceUrl}/partials/realm-identity-provider-${e.provider_id}.html`,
            resolve: {
              realm: (e) => e(),
              serverInfo: (e) => e(),
              instance: (e) => e(),
              providerFactory: (e) => e(),
              authFlows: (e) => e(),
            },
            controller: 'RealmIdentityProviderCtrl',
          },
        )
        .when(
          '/realms/:realm/identity-provider-settings/provider/:provider_id/:alias/export',
          {
            templateUrl: `${resourceUrl}/partials/realm-identity-provider-export.html`,
            resolve: {
              realm: (e) => e(),
              serverInfo: (e) => e(),
              identityProvider: (e) => e(),
              providerFactory: (e) => e(),
            },
            controller: 'RealmIdentityProviderExportCtrl',
          },
        )
        .when('/realms/:realm/identity-provider-mappers/:alias/mappers', {
          templateUrl: (_e) =>
            `${resourceUrl}/partials/identity-provider-mappers.html`,
          resolve: {
            realm: (e) => e(),
            identityProvider: (e) => e(),
            mapperTypes: (e) => e(),
            mappers: (e) => e(),
          },
          controller: 'IdentityProviderMapperListCtrl',
        })
        .when(
          '/realms/:realm/identity-provider-mappers/:alias/mappers/:mapperId',
          {
            templateUrl: (_e) =>
              `${resourceUrl}/partials/identity-provider-mapper-detail.html`,
            resolve: {
              realm: (e) => e(),
              identityProvider: (e) => e(),
              mapperTypes: (e) => e(),
              mapper: (e) => e(),
            },
            controller: 'IdentityProviderMapperCtrl',
          },
        )
        .when('/create/identity-provider-mappers/:realm/:alias', {
          templateUrl: (_e) =>
            `${resourceUrl}/partials/identity-provider-mapper-detail.html`,
          resolve: {
            realm: (e) => e(),
            identityProvider: (e) => e(),
            mapperTypes: (e) => e(),
          },
          controller: 'IdentityProviderMapperCreateCtrl',
        })
        .when('/realms/:realm/default-roles', {
          templateUrl: `${resourceUrl}/partials/realm-default-roles.html`,
          resolve: { realm: (e) => e(), roles: (e) => e() },
          controller: 'RealmDefaultRolesCtrl',
        })
        .when('/realms/:realm/smtp-settings', {
          templateUrl: `${resourceUrl}/partials/realm-smtp.html`,
          resolve: { realm: (e) => e() },
          controller: 'RealmSMTPSettingsCtrl',
        })
        .when('/realms/:realm/events', {
          templateUrl: `${resourceUrl}/partials/realm-events.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmEventsCtrl',
        })
        .when('/realms/:realm/admin-events', {
          templateUrl: `${resourceUrl}/partials/realm-events-admin.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmAdminEventsCtrl',
        })
        .when('/realms/:realm/events-settings', {
          templateUrl: `${resourceUrl}/partials/realm-events-config.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            eventsConfig: (e) => e(),
          },
          controller: 'RealmEventsConfigCtrl',
        })
        .when('/realms/:realm/partial-import', {
          templateUrl: `${resourceUrl}/partials/partial-import.html`,
          resolve: { resourceName: () => 'users', realm: (e) => e() },
          controller: 'RealmImportCtrl',
        })
        .when('/realms/:realm/partial-export', {
          templateUrl: `${resourceUrl}/partials/partial-export.html`,
          resolve: { realm: (e) => e() },
          controller: 'RealmExportCtrl',
        })
        .when('/create/user/:realm', {
          templateUrl: `${resourceUrl}/partials/user-detail.html`,
          resolve: { realm: (e) => e(), user: () => ({}) },
          controller: 'UserDetailCtrl',
        })
        .when('/realms/:realm/users/:user', {
          templateUrl: `${resourceUrl}/partials/user-detail.html`,
          resolve: { realm: (e) => e(), user: (e) => e() },
          controller: 'UserDetailCtrl',
        })
        .when('/realms/:realm/users/:user/user-attributes', {
          templateUrl: `${resourceUrl}/partials/user-attributes.html`,
          resolve: { realm: (e) => e(), user: (e) => e() },
          controller: 'UserDetailCtrl',
        })
        .when('/realms/:realm/users/:user/user-credentials', {
          templateUrl: `${resourceUrl}/partials/user-credentials.html`,
          resolve: { realm: (e) => e(), user: (e) => e() },
          controller: 'UserCredentialsCtrl',
        })
        .when('/realms/:realm/users/:user/role-mappings', {
          templateUrl: `${resourceUrl}/partials/role-mappings.html`,
          resolve: {
            realm: (e) => e(),
            user: (e) => e(),
            clients: (e) => e(),
            client: () => ({}),
          },
          controller: 'UserRoleMappingCtrl',
        })
        .when('/realms/:realm/users/:user/groups', {
          templateUrl: `${resourceUrl}/partials/user-group-membership.html`,
          resolve: { realm: (e) => e(), user: (e) => e() },
          controller: 'UserGroupMembershipCtrl',
        })
        .when('/realms/:realm/users/:user/sessions', {
          templateUrl: `${resourceUrl}/partials/user-sessions.html`,
          resolve: {
            realm: (e) => e(),
            user: (e) => e(),
            sessions: (e) => e(),
          },
          controller: 'UserSessionsCtrl',
        })
        .when('/realms/:realm/users/:user/federated-identity', {
          templateUrl: `${resourceUrl}/partials/user-federated-identity-list.html`,
          resolve: {
            realm: (e) => e(),
            user: (e) => e(),
            federatedIdentities: (e) => e(),
          },
          controller: 'UserFederatedIdentityCtrl',
        })
        .when('/create/federated-identity/:realm/:user', {
          templateUrl: `${resourceUrl}/partials/user-federated-identity-detail.html`,
          resolve: {
            realm: (e) => e(),
            user: (e) => e(),
            federatedIdentities: (e) => e(),
          },
          controller: 'UserFederatedIdentityAddCtrl',
        })
        .when('/realms/:realm/users/:user/consents', {
          templateUrl: `${resourceUrl}/partials/user-consents.html`,
          resolve: {
            realm: (e) => e(),
            user: (e) => e(),
            userConsents: (e) => e(),
          },
          controller: 'UserConsentsCtrl',
        })
        .when('/realms/:realm/users/:user/offline-sessions/:client', {
          templateUrl: `${resourceUrl}/partials/user-offline-sessions.html`,
          resolve: {
            realm: (e) => e(),
            user: (e) => e(),
            client: (e) => e(),
            offlineSessions: (e) => e(),
          },
          controller: 'UserOfflineSessionsCtrl',
        })
        .when('/realms/:realm/users', {
          templateUrl: `${resourceUrl}/partials/user-list.html`,
          resolve: { realm: (e) => e() },
          controller: 'UserListCtrl',
        })
        .when('/create/role/:realm', {
          templateUrl: `${resourceUrl}/partials/role-detail.html`,
          resolve: {
            realm: (e) => e(),
            role: () => ({}),
            roles: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'RoleDetailCtrl',
        })
        .when('/realms/:realm/roles/:role', {
          templateUrl: `${resourceUrl}/partials/role-detail.html`,
          resolve: {
            realm: (e) => e(),
            role: (e) => e(),
            roles: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'RoleDetailCtrl',
        })
        .when('/realms/:realm/roles/:role/role-attributes', {
          templateUrl: `${resourceUrl}/partials/role-attributes.html`,
          resolve: {
            realm: (e) => e(),
            role: (e) => e(),
            roles: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'RoleDetailCtrl',
        })
        .when('/realms/:realm/roles/:role/users', {
          templateUrl: `${resourceUrl}/partials/realm-role-users.html`,
          resolve: { realm: (e) => e(), role: (e) => e() },
          controller: 'RoleMembersCtrl',
        })
        .when('/realms/:realm/roles', {
          templateUrl: `${resourceUrl}/partials/role-list.html`,
          resolve: { realm: (e) => e() },
          controller: 'RoleListCtrl',
        })
        .when('/realms/:realm/groups', {
          templateUrl: `${resourceUrl}/partials/group-list.html`,
          resolve: { realm: (e) => e() },
          controller: 'GroupListCtrl',
        })
        .when('/create/group/:realm/parent/:parentId', {
          templateUrl: `${resourceUrl}/partials/create-group.html`,
          resolve: {
            realm: (e) => e(),
            parentId: (e) => e.current.params.parentId,
          },
          controller: 'GroupCreateCtrl',
        })
        .when('/realms/:realm/groups/:group', {
          templateUrl: `${resourceUrl}/partials/group-detail.html`,
          resolve: { realm: (e) => e(), group: (e) => e() },
          controller: 'GroupDetailCtrl',
        })
        .when('/realms/:realm/groups/:group/attributes', {
          templateUrl: `${resourceUrl}/partials/group-attributes.html`,
          resolve: { realm: (e) => e(), group: (e) => e() },
          controller: 'GroupDetailCtrl',
        })
        .when('/realms/:realm/groups/:group/members', {
          templateUrl: `${resourceUrl}/partials/group-members.html`,
          resolve: { realm: (e) => e(), group: (e) => e() },
          controller: 'GroupMembersCtrl',
        })
        .when('/realms/:realm/groups/:group/role-mappings', {
          templateUrl: `${resourceUrl}/partials/group-role-mappings.html`,
          resolve: {
            realm: (e) => e(),
            group: (e) => e(),
            clients: (e) => e(),
            client: () => ({}),
          },
          controller: 'GroupRoleMappingCtrl',
        })
        .when('/realms/:realm/default-groups', {
          templateUrl: `${resourceUrl}/partials/default-groups.html`,
          resolve: { realm: (e) => e() },
          controller: 'DefaultGroupsCtrl',
        })
        .when('/create/role/:realm/clients/:client', {
          templateUrl: `${resourceUrl}/partials/client-role-detail.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            role: () => ({}),
            roles: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientRoleDetailCtrl',
        })
        .when('/realms/:realm/clients/:client/roles/:role', {
          templateUrl: `${resourceUrl}/partials/client-role-detail.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            role: (e) => e(),
            roles: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientRoleDetailCtrl',
        })
        .when('/realms/:realm/clients/:client/roles/:role/role-attributes', {
          templateUrl: `${resourceUrl}/partials/client-role-attributes.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            role: (e) => e(),
            roles: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientRoleDetailCtrl',
        })
        .when('/realms/:realm/clients/:client/roles/:role/users', {
          templateUrl: `${resourceUrl}/partials/client-role-users.html`,
          resolve: { realm: (e) => e(), client: (e) => e(), role: (e) => e() },
          controller: 'ClientRoleMembersCtrl',
        })
        .when('/realms/:realm/clients/:client/mappers', {
          templateUrl: `${resourceUrl}/partials/client-mappers.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'ClientProtocolMapperListCtrl',
        })
        .when('/realms/:realm/clients/:client/add-mappers', {
          templateUrl: `${resourceUrl}/partials/client-mappers-add.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'AddBuiltinProtocolMapperCtrl',
        })
        .when('/realms/:realm/clients/:client/mappers/:id', {
          templateUrl: `${resourceUrl}/partials/client-protocol-mapper-detail.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            serverInfo: (e) => e(),
            mapper: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientProtocolMapperCtrl',
        })
        .when('/create/client/:realm/:client/mappers', {
          templateUrl: `${resourceUrl}/partials/client-protocol-mapper-detail.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            client: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientProtocolMapperCreateCtrl',
        })
        .when('/realms/:realm/clients/:client/client-scopes/setup-scopes', {
          templateUrl: `${resourceUrl}/partials/client-scopes-setup.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            clientScopes: (e) => e(),
            serverInfo: (e) => e(),
            clientDefaultClientScopes: (e) => e(),
            clientOptionalClientScopes: (e) => e(),
          },
          controller: 'ClientClientScopesSetupCtrl',
        })
        .when('/realms/:realm/clients/:client/client-scopes/evaluate-scopes', {
          templateUrl: `${resourceUrl}/partials/client-scopes-evaluate.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            clients: (e) => e(),
            clientScopes: (e) => e(),
            clientDefaultClientScopes: (e) => e(),
            clientOptionalClientScopes: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'ClientClientScopesEvaluateCtrl',
        })
        .when('/realms/:realm/client-scopes/:clientScope/mappers', {
          templateUrl: `${resourceUrl}/partials/client-scope-mappers.html`,
          resolve: {
            realm: (e) => e(),
            clientScope: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'ClientScopeProtocolMapperListCtrl',
        })
        .when('/realms/:realm/client-scopes/:clientScope/add-mappers', {
          templateUrl: `${resourceUrl}/partials/client-scope-mappers-add.html`,
          resolve: {
            realm: (e) => e(),
            clientScope: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'ClientScopeAddBuiltinProtocolMapperCtrl',
        })
        .when('/realms/:realm/client-scopes/:clientScope/mappers/:id', {
          templateUrl: `${resourceUrl}/partials/client-scope-protocol-mapper-detail.html`,
          resolve: {
            realm: (e) => e(),
            clientScope: (e) => e(),
            serverInfo: (e) => e(),
            mapper: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientScopeProtocolMapperCtrl',
        })
        .when('/create/client-scope/:realm/:clientScope/mappers', {
          templateUrl: `${resourceUrl}/partials/client-scope-protocol-mapper-detail.html`,
          resolve: {
            realm: (e) => e(),
            serverInfo: (e) => e(),
            clientScope: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientScopeProtocolMapperCreateCtrl',
        })
        .when('/realms/:realm/clients/:client/sessions', {
          templateUrl: `${resourceUrl}/partials/client-sessions.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            sessionCount: (e) => e(),
          },
          controller: 'ClientSessionsCtrl',
        })
        .when('/realms/:realm/clients/:client/offline-access', {
          templateUrl: `${resourceUrl}/partials/client-offline-sessions.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            offlineSessionCount: (e) => e(),
          },
          controller: 'ClientOfflineSessionsCtrl',
        })
        .when('/realms/:realm/clients/:client/credentials', {
          templateUrl: `${resourceUrl}/partials/client-credentials.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            clientAuthenticatorProviders: (e) => e(),
            clientConfigProperties: (e) => e(),
          },
          controller: 'ClientCredentialsCtrl',
        })
        .when(
          '/realms/:realm/clients/:client/credentials/client-jwt/:keyType/import/:attribute',
          {
            templateUrl: `${resourceUrl}/partials/client-credentials-jwt-key-import.html`,
            resolve: {
              realm: (e) => e(),
              client: (e) => e(),
              callingContext: () => 'jwt-credentials',
            },
            controller: 'ClientCertificateImportCtrl',
          },
        )
        .when(
          '/realms/:realm/clients/:client/credentials/client-jwt/:keyType/export/:attribute',
          {
            templateUrl: `${resourceUrl}/partials/client-credentials-jwt-key-export.html`,
            resolve: {
              realm: (e) => e(),
              client: (e) => e(),
              callingContext: () => 'jwt-credentials',
            },
            controller: 'ClientCertificateExportCtrl',
          },
        )
        .when('/realms/:realm/clients/:client/identity-provider', {
          templateUrl: `${resourceUrl}/partials/client-identity-provider.html`,
          resolve: { realm: (e) => e(), client: (e) => e() },
          controller: 'ClientIdentityProviderCtrl',
        })
        .when('/realms/:realm/clients/:client/clustering', {
          templateUrl: `${resourceUrl}/partials/client-clustering.html`,
          resolve: { realm: (e) => e(), client: (e) => e() },
          controller: 'ClientClusteringCtrl',
        })
        .when('/register-node/realms/:realm/clients/:client/clustering', {
          templateUrl: `${resourceUrl}/partials/client-clustering-node.html`,
          resolve: { realm: (e) => e(), client: (e) => e() },
          controller: 'ClientClusteringNodeCtrl',
        })
        .when('/realms/:realm/clients/:client/clustering/:node', {
          templateUrl: `${resourceUrl}/partials/client-clustering-node.html`,
          resolve: { realm: (e) => e(), client: (e) => e() },
          controller: 'ClientClusteringNodeCtrl',
        })
        .when('/realms/:realm/clients/:client/saml/keys', {
          templateUrl: `${resourceUrl}/partials/client-saml-keys.html`,
          resolve: { realm: (e) => e(), client: (e) => e() },
          controller: 'ClientSamlKeyCtrl',
        })
        .when(
          '/realms/:realm/clients/:client/saml/:keyType/import/:attribute',
          {
            templateUrl: `${resourceUrl}/partials/client-saml-key-import.html`,
            resolve: {
              realm: (e) => e(),
              client: (e) => e(),
              callingContext: () => 'saml',
            },
            controller: 'ClientCertificateImportCtrl',
          },
        )
        .when(
          '/realms/:realm/clients/:client/saml/:keyType/export/:attribute',
          {
            templateUrl: `${resourceUrl}/partials/client-saml-key-export.html`,
            resolve: {
              realm: (e) => e(),
              client: (e) => e(),
              callingContext: () => 'saml',
            },
            controller: 'ClientCertificateExportCtrl',
          },
        )
        .when('/realms/:realm/clients/:client/roles', {
          templateUrl: `${resourceUrl}/partials/client-role-list.html`,
          resolve: { realm: (e) => e(), client: (e) => e() },
          controller: 'ClientRoleListCtrl',
        })
        .when('/realms/:realm/clients/:client/revocation', {
          templateUrl: `${resourceUrl}/partials/client-revocation.html`,
          resolve: { realm: (e) => e(), client: (e) => e() },
          controller: 'ClientRevocationCtrl',
        })
        .when('/realms/:realm/clients/:client/scope-mappings', {
          templateUrl: `${resourceUrl}/partials/client-scope-mappings.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientScopeMappingCtrl',
        })
        .when('/realms/:realm/clients/:client/installation', {
          templateUrl: `${resourceUrl}/partials/client-installation.html`,
          resolve: {
            realm: (e) => e(),
            client: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'ClientInstallationCtrl',
        })
        .when('/realms/:realm/clients/:client/service-account-roles', {
          templateUrl: `${resourceUrl}/partials/client-service-account-roles.html`,
          resolve: {
            realm: (e) => e(),
            user: (e) => e(),
            clients: (e) => e(),
            client: (e) => e(),
          },
          controller: 'UserRoleMappingCtrl',
        })
        .when('/create/client/:realm', {
          templateUrl: `${resourceUrl}/partials/create-client.html`,
          resolve: {
            realm: (e) => e(),
            clients: (e) => e(),
            client: () => ({}),
            flows: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'CreateClientCtrl',
        })
        .when('/realms/:realm/clients/:client', {
          templateUrl: `${resourceUrl}/partials/client-detail.html`,
          resolve: {
            realm: (e) => e(),
            clients: (e) => e(),
            client: (e) => e(),
            flows: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'ClientDetailCtrl',
        })
        .when('/create/client-scope/:realm', {
          templateUrl: `${resourceUrl}/partials/client-scope-detail.html`,
          resolve: {
            realm: (e) => e(),
            clientScope: () => ({}),
            serverInfo: (e) => e(),
          },
          controller: 'ClientScopeDetailCtrl',
        })
        .when('/realms/:realm/client-scopes/:clientScope', {
          templateUrl: `${resourceUrl}/partials/client-scope-detail.html`,
          resolve: {
            realm: (e) => e(),
            clientScope: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'ClientScopeDetailCtrl',
        })
        .when('/realms/:realm/client-scopes/:clientScope/scope-mappings', {
          templateUrl: `${resourceUrl}/partials/client-scope-scope-mappings.html`,
          resolve: {
            realm: (e) => e(),
            clientScope: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'ClientScopeScopeMappingCtrl',
        })
        .when('/realms/:realm/clients', {
          templateUrl: `${resourceUrl}/partials/client-list.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'ClientListCtrl',
        })
        .when('/realms/:realm/client-scopes', {
          templateUrl: `${resourceUrl}/partials/client-scope-list.html`,
          resolve: {
            realm: (e) => e(),
            clientScopes: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'ClientScopeListCtrl',
        })
        .when('/realms/:realm/default-client-scopes', {
          templateUrl: `${resourceUrl}/partials/client-scopes-realm-default.html`,
          resolve: {
            realm: (e) => e(),
            clientScopes: (e) => e(),
            serverInfo: (e) => e(),
            realmDefaultClientScopes: (e) => e(),
            realmOptionalClientScopes: (e) => e(),
          },
          controller: 'ClientScopesRealmDefaultCtrl',
        })
        .when('/import/client/:realm', {
          templateUrl: `${resourceUrl}/partials/client-import.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'ClientImportCtrl',
        })
        .when('/realms/:realm/client-stores', {
          templateUrl: `${resourceUrl}/partials/client-storage-list.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'ClientStoresCtrl',
        })
        .when(
          '/realms/:realm/client-storage/providers/:provider/:componentId',
          {
            templateUrl: `${resourceUrl}/partials/client-storage-generic.html`,
            resolve: {
              realm: (e) => e(),
              instance: (e) => e(),
              providerId: (e) => e.current.params.provider,
              serverInfo: (e) => e(),
            },
            controller: 'GenericClientStorageCtrl',
          },
        )
        .when('/create/client-storage/:realm/providers/:provider', {
          templateUrl: `${resourceUrl}/partials/client-storage-generic.html`,
          resolve: {
            realm: (e) => e(),
            instance: () => ({}),
            providerId: (e) => e.current.params.provider,
            serverInfo: (e) => e(),
          },
          controller: 'GenericClientStorageCtrl',
        })
        .when('/', {
          templateUrl: `${resourceUrl}/partials/home.html`,
          controller: 'HomeCtrl',
        })
        .when('/mocks/:realm', {
          templateUrl: `${resourceUrl}/partials/realm-detail_mock.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmDetailCtrl',
        })
        .when('/realms/:realm/sessions/revocation', {
          templateUrl: `${resourceUrl}/partials/session-revocation.html`,
          resolve: { realm: (e) => e() },
          controller: 'RealmRevocationCtrl',
        })
        .when('/realms/:realm/sessions/realm', {
          templateUrl: `${resourceUrl}/partials/session-realm.html`,
          resolve: { realm: (e) => e(), stats: (e) => e() },
          controller: 'RealmSessionStatsCtrl',
        })
        .when('/create/user-storage/:realm/providers/ldap', {
          templateUrl: `${resourceUrl}/partials/user-storage-ldap.html`,
          resolve: {
            realm: (e) => e(),
            instance: () => ({}),
            providerId: (e) => e.current.params.provider,
            serverInfo: (e) => e(),
          },
          controller: 'LDAPUserStorageCtrl',
        })
        .when('/create/user-storage/:realm/providers/kerberos', {
          templateUrl: `${resourceUrl}/partials/user-storage-kerberos.html`,
          resolve: {
            realm: (e) => e(),
            instance: () => ({}),
            providerId: (_e) => 'kerberos',
            serverInfo: (e) => e(),
          },
          controller: 'GenericUserStorageCtrl',
        })
        .when('/create/user-storage/:realm/providers/:provider', {
          templateUrl: `${resourceUrl}/partials/user-storage-generic.html`,
          resolve: {
            realm: (e) => e(),
            instance: () => ({}),
            providerId: (e) => e.current.params.provider,
            serverInfo: (e) => e(),
          },
          controller: 'GenericUserStorageCtrl',
        })
        .when('/realms/:realm/user-storage/providers/ldap/:componentId', {
          templateUrl: `${resourceUrl}/partials/user-storage-ldap.html`,
          resolve: {
            realm: (e) => e(),
            instance: (e) => e(),
            providerId: (e) => e.current.params.provider,
            serverInfo: (e) => e(),
          },
          controller: 'LDAPUserStorageCtrl',
        })
        .when('/realms/:realm/user-storage/providers/kerberos/:componentId', {
          templateUrl: `${resourceUrl}/partials/user-storage-kerberos.html`,
          resolve: {
            realm: (e) => e(),
            instance: (e) => e(),
            providerId: (_e) => 'kerberos',
            serverInfo: (e) => e(),
          },
          controller: 'GenericUserStorageCtrl',
        })
        .when('/realms/:realm/user-storage/providers/:provider/:componentId', {
          templateUrl: `${resourceUrl}/partials/user-storage-generic.html`,
          resolve: {
            realm: (e) => e(),
            instance: (e) => e(),
            providerId: (e) => e.current.params.provider,
            serverInfo: (e) => e(),
          },
          controller: 'GenericUserStorageCtrl',
        })
        .when('/realms/:realm/ldap-mappers/:componentId', {
          templateUrl: (_e) =>
            `${resourceUrl}/partials/user-storage-ldap-mappers.html`,
          resolve: {
            realm: (e) => e(),
            provider: (e) => e(),
            mappers: (e, r) =>
              e.loadComponents(
                r.current.params.componentId,
                'org.keycloak.storage.ldap.mappers.LDAPStorageMapper',
              ),
          },
          controller: 'LDAPMapperListCtrl',
        })
        .when('/create/ldap-mappers/:realm/:componentId', {
          templateUrl: (_e) =>
            `${resourceUrl}/partials/user-storage-ldap-mapper-detail.html`,
          resolve: {
            realm: (e) => e(),
            provider: (e) => e(),
            mapperTypes: (e, r) =>
              e.loadComponents(
                r.current.params.componentId,
                'org.keycloak.storage.ldap.mappers.LDAPStorageMapper',
              ),
            clients: (e) => e(),
          },
          controller: 'LDAPMapperCreateCtrl',
        })
        .when('/realms/:realm/ldap-mappers/:componentId/mappers/:mapperId', {
          templateUrl: (_e) =>
            `${resourceUrl}/partials/user-storage-ldap-mapper-detail.html`,
          resolve: {
            realm: (e) => e(),
            provider: (e) => e(),
            mapperTypes: (e, r) =>
              e.loadComponents(
                r.current.params.componentId,
                'org.keycloak.storage.ldap.mappers.LDAPStorageMapper',
              ),
            mapper: (e) => e(),
            clients: (e) => e(),
          },
          controller: 'LDAPMapperCtrl',
        })
        .when('/realms/:realm/user-federation', {
          templateUrl: `${resourceUrl}/partials/user-federation.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'UserFederationCtrl',
        })
        .when('/realms/:realm/defense/headers', {
          templateUrl: `${resourceUrl}/partials/defense-headers.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'DefenseHeadersCtrl',
        })
        .when('/realms/:realm/defense/brute-force', {
          templateUrl: `${resourceUrl}/partials/brute-force.html`,
          resolve: { realm: (e) => e() },
          controller: 'RealmBruteForceCtrl',
        })
        .when('/realms/:realm/protocols', {
          templateUrl: `${resourceUrl}/partials/protocol-list.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'ProtocolListCtrl',
        })
        .when('/realms/:realm/authentication/flows', {
          templateUrl: `${resourceUrl}/partials/authentication-flows.html`,
          resolve: {
            realm: (e) => e(),
            flows: (e) => e(),
            selectedFlow: () => null,
          },
          controller: 'AuthenticationFlowsCtrl',
        })
        .when('/realms/:realm/authentication/flow-bindings', {
          templateUrl: `${resourceUrl}/partials/authentication-flow-bindings.html`,
          resolve: {
            realm: (e) => e(),
            flows: (e) => e(),
            serverInfo: (e) => e(),
          },
          controller: 'RealmFlowBindingCtrl',
        })
        .when('/realms/:realm/authentication/flows/:flow', {
          templateUrl: `${resourceUrl}/partials/authentication-flows.html`,
          resolve: {
            realm: (e) => e(),
            flows: (e) => e(),
            selectedFlow: (e) => e.current.params.flow,
          },
          controller: 'AuthenticationFlowsCtrl',
        })
        .when(
          '/realms/:realm/authentication/flows/:flow/create/execution/:topFlow',
          {
            templateUrl: `${resourceUrl}/partials/create-execution.html`,
            resolve: {
              realm: (e) => e(),
              topFlow: (e) => e.current.params.topFlow,
              parentFlow: (e) => e(),
              formActionProviders: (e) => e(),
              authenticatorProviders: (e) => e(),
              clientAuthenticatorProviders: (e) => e(),
            },
            controller: 'CreateExecutionCtrl',
          },
        )
        .when(
          '/realms/:realm/authentication/flows/:flow/create/flow/execution/:topFlow',
          {
            templateUrl: `${resourceUrl}/partials/create-flow-execution.html`,
            resolve: {
              realm: (e) => e(),
              topFlow: (e) => e.current.params.topFlow,
              parentFlow: (e) => e(),
              formProviders: (e) => e(),
            },
            controller: 'CreateExecutionFlowCtrl',
          },
        )
        .when('/realms/:realm/authentication/create/flow', {
          templateUrl: `${resourceUrl}/partials/create-flow.html`,
          resolve: { realm: (e) => e() },
          controller: 'CreateFlowCtrl',
        })
        .when('/realms/:realm/authentication/required-actions', {
          templateUrl: `${resourceUrl}/partials/required-actions.html`,
          resolve: {
            realm: (e) => e(),
            unregisteredRequiredActions: (e) => e(),
          },
          controller: 'RequiredActionsCtrl',
        })
        .when('/realms/:realm/authentication/password-policy', {
          templateUrl: `${resourceUrl}/partials/password-policy.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmPasswordPolicyCtrl',
        })
        .when('/realms/:realm/authentication/otp-policy', {
          templateUrl: `${resourceUrl}/partials/otp-policy.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmOtpPolicyCtrl',
        })
        .when('/realms/:realm/authentication/webauthn-policy', {
          templateUrl: `${resourceUrl}/partials/webauthn-policy.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmWebAuthnPolicyCtrl',
        })
        .when('/realms/:realm/authentication/webauthn-policy-passwordless', {
          templateUrl: `${resourceUrl}/partials/webauthn-policy-passwordless.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmWebAuthnPasswordlessPolicyCtrl',
        })
        .when('/realms/:realm/authentication/ciba-policy', {
          templateUrl: `${resourceUrl}/partials/ciba-policy.html`,
          resolve: { realm: (e) => e(), serverInfo: (e) => e() },
          controller: 'RealmCibaPolicyCtrl',
        })
        .when(
          '/realms/:realm/authentication/flows/:flow/config/:provider/:config',
          {
            templateUrl: `${resourceUrl}/partials/authenticator-config.html`,
            resolve: {
              realm: (e) => e(),
              flow: (e) => e(),
              configType: (e) => e(),
              config: (e) => e(),
            },
            controller: 'AuthenticationConfigCtrl',
          },
        )
        .when(
          '/create/authentication/:realm/flows/:flow/execution/:executionId/provider/:provider',
          {
            templateUrl: `${resourceUrl}/partials/authenticator-config.html`,
            resolve: {
              realm: (e) => e(),
              flow: (e) => e(),
              configType: (e) => e(),
              execution: (e) => e(),
            },
            controller: 'AuthenticationConfigCreateCtrl',
          },
        )
        .when('/create/localization/:realm/:locale', {
          templateUrl: `${resourceUrl}/partials/realm-localization-detail.html`,
          resolve: {
            realm: (e) => e(),
            locale: (e) => e.current.params.locale,
            key: () => null,
            localizationText: () => null,
          },
          controller: 'RealmLocalizationDetailCtrl',
        })
        .when('/realms/:realm/localization/:locale/:key', {
          templateUrl: `${resourceUrl}/partials/realm-localization-detail.html`,
          resolve: {
            realm: (e) => e(),
            locale: (e) => e.current.params.locale,
            key: (e) => e.current.params.key,
            localizationText: (e) => e(),
          },
          controller: 'RealmLocalizationDetailCtrl',
        })
        .when('/server-info', {
          templateUrl: `${resourceUrl}/partials/server-info.html`,
          resolve: { serverInfo: (e) => e() },
          controller: 'ServerInfoCtrl',
        })
        .when('/server-info/providers', {
          templateUrl: `${resourceUrl}/partials/server-info-providers.html`,
          resolve: { serverInfo: (e) => e() },
          controller: 'ServerInfoCtrl',
        })
        .when('/logout', {
          templateUrl: `${resourceUrl}/partials/home.html`,
          controller: 'LogoutCtrl',
        })
        .when('/notfound', {
          templateUrl: `${resourceUrl}/partials/notfound.html`,
        })
        .when('/forbidden', {
          templateUrl: `${resourceUrl}/partials/forbidden.html`,
        })
        .otherwise({
          templateUrl: `${resourceUrl}/partials/pagenotfound.html`,
        });
    },
  ]),
  module.config((e) => {
    e.interceptors.push('errorInterceptor');
    e.defaults.transformRequest.push(
      (e, _r) => (
        0 === resourceRequests &&
          (loadingTimer = window.setTimeout(() => {
            $('#loading').show(), (loadingTimer = -1);
          }, 500)),
        resourceRequests++,
        e
      ),
    ),
      e.interceptors.push('spinnerInterceptor'),
      e.interceptors.push('authInterceptor');
  }),
  module.factory('spinnerInterceptor', (e, _r, _t, _n) => ({
    response: (e) => (
      0 === --resourceRequests &&
        (-1 !== loadingTimer &&
          (window.clearTimeout(loadingTimer), (loadingTimer = -1)),
        $('#loading').hide()),
      e
    ),
    responseError: (r) => (
      0 === --resourceRequests &&
        (-1 !== loadingTimer &&
          (window.clearTimeout(loadingTimer), (loadingTimer = -1)),
        $('#loading').hide()),
      e.reject(r)
    ),
  })),
  module.factory('errorInterceptor', (e, _r, _t, n, l, o) => ({
    response: (e) => e,
    responseError: (r) => (
      401 === r.status
        ? o.authz.logout()
        : 403 === r.status
          ? n.path('/forbidden')
          : 404 === r.status
            ? n.path('/notfound')
            : r.status
              ? r.data?.errorMessage
                ? l.error(r.data.errorMessage)
                : r.data?.error_description
                  ? l.error(r.data.error_description)
                  : l.error('An unexpected server error has occurred')
              : l.error('No response from server.'),
      e.reject(r)
    ),
  })),
  module.directive('collapsable', () => (_e, r, _t) => {
    r.click(function () {
      $(this).toggleClass('collapsed'),
        $(this)
          .find('.toggle-icons')
          .toggleClass('kc-icon-collapse')
          .toggleClass('kc-icon-expand'),
        $(this)
          .find('.toggle-icons')
          .text(
            'Icon: expand' === $(this).text()
              ? 'Icon: collapse'
              : 'Icon: expand',
          ),
        $(this).parent().find('.form-group').toggleClass('hidden');
    });
  }),
  module.directive('uncollapsed', () => (_e, r, _t) => {
    r.prepend('<i class="toggle-class fa fa-angle-down"></i> '),
      r.click(function () {
        $(this)
          .find('.toggle-class')
          .toggleClass('fa-angle-down')
          .toggleClass('fa-angle-right'),
          $(this).parent().find('.form-group').toggleClass('hidden');
      });
  }),
  module.directive('collapsed', () => (_e, r, _t) => {
    r.prepend('<i class="toggle-class fa fa-angle-right"></i> '),
      r.parent().find('.form-group').toggleClass('hidden'),
      r.click(function () {
        $(this)
          .find('.toggle-class')
          .toggleClass('fa-angle-down')
          .toggleClass('fa-angle-right'),
          $(this).parent().find('.form-group').toggleClass('hidden');
      });
  }),
  module.directive('onoffswitch', () => ({
    restrict: 'EA',
    replace: !0,
    scope: {
      name: '@',
      id: '@',
      ngModel: '=',
      ngDisabled: '=',
      kcOnText: '@onText',
      kcOffText: '@offText',
    },
    template:
      "<span><div class='onoffswitch' tabindex='0'><input type='checkbox' ng-model='ngModel' ng-disabled='ngDisabled' class='onoffswitch-checkbox' name='{{name}}' id='{{id}}'><label for='{{id}}' class='onoffswitch-label'><span class='onoffswitch-inner'><span class='onoffswitch-active'>{{kcOnText}}</span><span class='onoffswitch-inactive'>{{kcOffText}}</span></span><span class='onoffswitch-switch'></span></label></div></span>",
    compile: (e, r) => {
      e.removeAttr('name'),
        e.removeAttr('id'),
        r.onText || (r.onText = 'ON'),
        r.offText || (r.offText = 'OFF'),
        e.bind('keydown', (e) => {
          var r = e.keyCode || e.which;
          (32 !== r && 13 !== r) ||
            (e.stopImmediatePropagation(),
            e.preventDefault(),
            $(e.target).find('input').click());
        });
    },
  })),
  module.directive('onoffswitchstring', () => ({
    restrict: 'EA',
    replace: !0,
    scope: {
      name: '=',
      id: '=',
      value: '=',
      ngModel: '=',
      ngDisabled: '=',
      kcOnText: '@onText',
      kcOffText: '@offText',
    },
    template:
      '<span><div class="onoffswitch" tabindex="0"><input type="checkbox" ng-true-value="\'true\'" ng-false-value="\'false\'" ng-model="ngModel" ng-disabled="ngDisabled" class="onoffswitch-checkbox" name="kc{{name}}" id="kc{{id}}"><label for="kc{{id}}" class="onoffswitch-label"><span class="onoffswitch-inner"><span class="onoffswitch-active">{{kcOnText}}</span><span class="onoffswitch-inactive">{{kcOffText}}</span></span><span class="onoffswitch-switch"></span></label></div></span>',
    compile: (e, r) => {
      r.onText || (r.onText = 'ON'),
        r.offText || (r.offText = 'OFF'),
        e.bind('keydown click', (e) => {
          var r = e.keyCode || e.which;
          (32 !== r && 13 !== r) ||
            (e.stopImmediatePropagation(),
            e.preventDefault(),
            $(e.target).find('input').click());
        });
    },
  })),
  module.directive('onoffswitchvalue', () => ({
    restrict: 'EA',
    replace: !0,
    scope: {
      name: '@',
      id: '@',
      trueValue: '@',
      falseValue: '@',
      ngModel: '=',
      ngDisabled: '=',
      kcOnText: '@onText',
      kcOffText: '@offText',
    },
    template:
      "<span><div class='onoffswitch' tabindex='0'><input type='checkbox' ng-true-value='{{trueValue}}' ng-false-value='{{falseValue}}' ng-model='ngModel' ng-disabled='ngDisabled' class='onoffswitch-checkbox' name='{{name}}' id='{{id}}'><label for='{{id}}' class='onoffswitch-label'><span class='onoffswitch-inner'><span class='onoffswitch-active'>{{kcOnText}}</span><span class='onoffswitch-inactive'>{{kcOffText}}</span></span><span class='onoffswitch-switch'></span></label></div></span>",
    compile: (e, r) => {
      e.removeAttr('name'),
        e.removeAttr('id'),
        r.trueValue || (r.trueValue = "'true'"),
        r.falseValue || (r.falseValue = "'false'"),
        r.onText || (r.onText = 'ON'),
        r.offText || (r.offText = 'OFF'),
        e.bind('keydown', (e) => {
          var r = e.keyCode || e.which;
          (32 !== r && 13 !== r) ||
            (e.stopImmediatePropagation(),
            e.preventDefault(),
            $(e.target).find('input').click());
        });
    },
  })),
  module.directive('kcInput', () => ({
    scope: !0,
    replace: !1,
    link: (_e, r, _t) => {
      var n = r.children('form'),
        l = r.children('label'),
        o = r.children('input'),
        i = `${n.attr('name')}.${o.attr('name')}`;
      r.attr('class', 'control-group'),
        l.attr('class', 'control-label'),
        l.attr('for', i),
        o.wrap('<div class="controls"/>'),
        o.attr('id', i),
        o.attr('placeHolder') || o.attr('placeHolder', l.text()),
        o.attr('required') && l.append(' <span class="required">*</span>');
    },
  })),
  module.directive('kcEnter', () => (e, r, t) => {
    r.bind('keydown keypress', (r) => {
      13 === r.which &&
        (e.$apply(() => {
          e.$eval(t.kcEnter);
        }),
        r.preventDefault());
    });
  }),
  module.directive('kcNoReservedChars', (e, r) => (t, n) => {
    n.bind('keypress', (n) => {
      var l = String.fromCharCode(n.which || n.keyCode || 0);
      (l.match('[:/?#[@!$&()*+,;=]') || ']' === l || "'" === l) &&
        (n.preventDefault(),
        t.$apply(() => {
          e.warn(r.instant('key-not-allowed-here', { character: l }));
        }));
    });
  }),
  module.directive('kcSave', (_e, r, t) => ({
    restrict: 'A',
    link: (e, n, _l, _o) => {
      n.addClass('btn btn-primary'), n.attr('type', 'submit');
      var i = !1;
      n.on('click', (l) => {
        if (!Object.hasOwn(e, 'changed') || e.changed) {
          if (i) return l.preventDefault(), void l.stopImmediatePropagation();
          (i = !0),
            r(
              () => {
                i = !1;
              },
              500,
              !1,
            ),
            e.$apply(() => {
              var r = n.closest('form');
              if (r?.attr('name')) {
                var l = r.find('.ng-valid');
                if (e[r.attr('name')].$valid)
                  l.parent().removeClass('has-error'), e.save();
                else
                  t.error(
                    'Missing or invalid field(s). Please verify the fields in red.',
                  ),
                    l.parent().removeClass('has-error'),
                    r.find('.ng-invalid').parent().addClass('has-error');
              }
            });
        }
      });
    },
  })),
  module.directive('kcReset', (_e, _r) => ({
    restrict: 'A',
    link: (e, r, _t, _n) => {
      r.addClass('btn btn-default'),
        r.attr('type', 'submit'),
        r.bind('click', () => {
          e.$apply(() => {
            var t = r.closest('form');
            t?.attr('name') &&
              (t.find('.ng-valid').removeClass('error'),
              t.find('.ng-invalid').removeClass('error'),
              e.reset());
          });
        });
    },
  })),
  module.directive('kcCancel', (_e, _r) => ({
    restrict: 'A',
    link: (_e, r, _t, _n) => {
      r.addClass('btn btn-default'), r.attr('type', 'submit');
    },
  })),
  module.directive('kcDelete', (_e, _r) => ({
    restrict: 'A',
    link: (_e, r, _t, _n) => {
      r.addClass('btn btn-danger'), r.attr('type', 'submit');
    },
  })),
  module.directive('kcDropdown', (_e, _r) => ({
    scope: { kcOptions: '=', kcModel: '=', id: '=', kcPlaceholder: '@' },
    restrict: 'EA',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-select.html`,
    link: (e, _r, _t) => {
      e.updateModel = (r) => {
        e.kcModel = r;
      };
    },
  })),
  module.directive('kcReadOnly', () => {
    var e = {};
    return {
      replace: !1,
      link: (r, t, n) => {
        var l = (r, t) => {
            t.disabled || ((e[t.tagName + r] = !0), (t.disabled = !0));
          },
          o = (r, t) => {
            e[t.tagName + r] && ((t.disabled = !1), delete e[r]);
          },
          i = (_e, r) => !r.attributes['kc-read-only-ignore'];
        r.$watch(n.kcReadOnly, (e) => {
          e
            ? (t.find('input').filter(i).each(l),
              t.find('button').filter(i).each(l),
              t.find('select').filter(i).each(l),
              t.find('textarea').filter(i).each(l))
            : (t.find('input').filter(i).each(o),
              t.find('input').filter(i).each(o),
              t.find('button').filter(i).each(o),
              t.find('select').filter(i).each(o),
              t.find('textarea').filter(i).each(o));
        });
      },
    };
  }),
  module.directive('kcMenu', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-menu.html`,
  })),
  module.directive('kcTabsRealm', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-realm.html`,
  })),
  module.directive('kcTabsAuthentication', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-authentication.html`,
  })),
  module.directive('kcTabsRole', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-role.html`,
  })),
  module.directive('kcTabsClientRole', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-client-role.html`,
  })),
  module.directive('kcTabsUser', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-user.html`,
  })),
  module.directive('kcTabsUsers', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-users.html`,
  })),
  module.directive('kcTabsClients', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-clients.html`,
  })),
  module.directive('kcTabsGroup', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-group.html`,
  })),
  module.directive('kcTabsGroupList', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-group-list.html`,
  })),
  module.directive('kcTabsClient', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-client.html`,
  })),
  module.directive('kcTabsClientScope', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-client-scope.html`,
  })),
  module.directive('kcNavigationUser', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-navigation-user.html`,
  })),
  module.directive('kcTabsIdentityProvider', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-identity-provider.html`,
  })),
  module.directive('kcTabsUserFederation', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-user-federation.html`,
  })),
  module.directive('kcTabsLdap', () => ({
    scope: !0,
    restrict: 'E',
    replace: !0,
    templateUrl: `${resourceUrl}/templates/kc-tabs-ldap.html`,
  })),
  module.controller('RoleSelectorModalCtrl', (e, r, t, n, l, o, i, a) => {
    (e.selectedRealmRole = { role: void 0 }),
      (e.selectedClientRole = { role: void 0 }),
      (e.client = { selected: void 0 }),
      (e.selectRealmRole = () => {
        (t[n] = e.selectedRealmRole.role.name), a.close();
      }),
      (e.selectClientRole = () => {
        (t[n] =
          `${e.selectedClient.clientId}.${e.selectedClientRole.role.name}`),
          a.close();
      }),
      (e.cancel = () => {
        a.dismiss();
      }),
      clientSelectControl(e, r.realm, o),
      (e.selectedClient = null),
      (e.changeClient = (t) => {
        (e.selectedClient = t),
          t?.id
            ? (e.selectedClient
                ? i.query(
                    { realm: r.realm, client: e.selectedClient.id },
                    (r) => {
                      e.clientRoles = r;
                    },
                  )
                : (console.log('selected client was null'),
                  (e.clientRoles = null)),
              (e.selectedClient = t))
            : (e.selectedClient = null);
      }),
      l.query({ realm: r.realm }, (r) => {
        e.realmRoles = r;
      });
  }),
  module.controller('ProviderConfigCtrl', (e, r, t, n, l) => {
    clientSelectControl(r, t.current.params.realm, l),
      (r.fileNames = {}),
      (r.newMapEntries = {});
    var o = {},
      i = {},
      a = null;
    (r.initEditor = (e) => {
      e.$blockScrolling = 1 / 0;
    }),
      (r.initSelectedClient = (e, n) => {
        n[e] &&
          ((r.selectedClient = null),
          l.query(
            {
              realm: t.current.params.realm,
              search: !1,
              clientId: n[e],
              max: 1,
            },
            (e) => {
              e.length > 0 &&
                ((r.selectedClient = angular.copy(e[0])),
                (r.selectedClient.text = r.selectedClient.clientId));
            },
          ));
      }),
      (r.openRoleSelector = (t, n) => {
        e.open({
          templateUrl: `${resourceUrl}/partials/modal/role-selector.html`,
          controller: 'RoleSelectorModalCtrl',
          resolve: {
            realm: () => r.realm,
            config: () => n,
            configName: () => t,
          },
        });
      }),
      (r.changeClient = (e, t, n, l) => {
        if (!n?.id) return (t[e] = null), void (r.selectedClient = null);
        (r.selectedClient = n),
          l ? (t[e][0] = n.clientId) : (t[e] = n.clientId);
      }),
      n.convertAllMultivaluedStringValuesToList(r.properties, r.config),
      n.addLastEmptyValueToMultivaluedLists(r.properties, r.config),
      (r.addValueToMultivalued = (e) => {
        var t = r.config[e],
          n = t.length - 1,
          l = t[n];
        console.log(`Option=${e}, lastIndex=${n}, lastValue=${l}`),
          l.length > 0 && t.push('');
      }),
      (r.deleteValueFromMultivalued = (e, t) => {
        r.config[e].splice(t, 1);
      }),
      (r.uploadFile = (e, t, n) => {
        var l = new FileReader();
        (l.onload = (e) => {
          r.$apply(() => {
            n[t][0] = e.target.result;
          });
        }),
          l.readAsText(e[0]),
          (r.fileNames[t] = e[0].name);
      }),
      (r.addMapEntry = (e) => {
        r.removeMapEntry(e, r.newMapEntries[e].key);
        var t = JSON.parse(r.config[e]);
        t.push(r.newMapEntries[e]),
          (r.config[e] = JSON.stringify(t)),
          delete r.newMapEntries[e];
      }),
      (r.removeMapEntry = (e, t) => {
        for (var n = JSON.parse(r.config[e]), l = n.length - 1; l >= 0; l--)
          n[l].key === t && n.splice(l, 1);
        r.config[e] = JSON.stringify(n);
      }),
      (r.updateMapEntry = (e, t, n) => {
        for (var l = JSON.parse(r.config[e]), o = l.length - 1; o >= 0; o--)
          l[o].key === t && (l[o].value = n);
        (r.config[e] = JSON.stringify(l)), (a = `mapValue-${e}-${t}`);
      }),
      (r.jsonParseMap = (e) => {
        void 0 === i[e] &&
          ((o[e] = '[]'),
          (i[e] = []),
          Object.hasOwn(r.config, e)
            ? ((o[e] = r.config[e]), (i[e] = JSON.parse(o[e])))
            : (r.config[e] = o[e]));
        var t = r.config[e] !== o[e];
        return (
          t && ((o[e] = r.config[e]), (i[e] = JSON.parse(o[e]))),
          t || null === a || (document.getElementById(a).focus(), (a = null)),
          i[e]
        );
      });
  }),
  module.directive('kcProviderConfig', (_e) => ({
    scope: {
      config: '=',
      properties: '=',
      realm: '=',
      clients: '=',
      configName: '=',
    },
    restrict: 'E',
    replace: !0,
    controller: 'ProviderConfigCtrl',
    templateUrl: `${resourceUrl}/templates/kc-provider-config.html`,
  })),
  module.controller(
    'ComponentRoleSelectorModalCtrl',
    (e, r, t, n, l, o, i, a) => {
      (e.selectedRealmRole = { role: void 0 }),
        (e.selectedClientRole = { role: void 0 }),
        (e.client = { selected: void 0 }),
        (e.selectRealmRole = () => {
          (t[n][0] = e.selectedRealmRole.role.name), a.close();
        }),
        (e.selectClientRole = () => {
          (t[n][0] =
            `${e.client.selected.clientId}.${e.selectedClientRole.role.name}`),
            a.close();
        }),
        (e.cancel = () => {
          a.dismiss();
        }),
        (e.changeClient = () => {
          e.client.selected
            ? i.query({ realm: r.realm, client: e.client.selected.id }, (r) => {
                e.clientRoles = r;
              })
            : (console.log('selected client was null'), (e.clientRoles = null));
        }),
        l.query({ realm: r.realm }, (r) => {
          e.realmRoles = r;
        }),
        o.query({ realm: r.realm }, (r) => {
          (e.clients = r),
            r.length > 0 && ((e.client.selected = r[0]), e.changeClient());
        });
    },
  ),
  module.controller('ComponentConfigCtrl', (e, r, t, n) => {
    (r.initSelectedClient = (e, l) => {
      l[e] &&
        ((r.selectedClient = null),
        n.query(
          { realm: t.current.params.realm, search: !1, clientId: l[e], max: 1 },
          (e) => {
            e.length > 0 &&
              ((r.selectedClient = angular.copy(e[0])),
              (r.selectedClient.text = r.selectedClient.clientId));
          },
        ));
    }),
      (r.changeClient = (e, t, n) => {
        if (!n?.id) return (t[e] = null), void (r.selectedClient = null);
        (r.selectedClient = n), (t[e] = n.clientId);
      }),
      (r.openRoleSelector = (t, n) => {
        e.open({
          templateUrl: `${resourceUrl}/partials/modal/component-role-selector.html`,
          controller: 'ComponentRoleSelectorModalCtrl',
          resolve: {
            realm: () => r.realm,
            config: () => n,
            configName: () => t,
          },
        });
      });
  }),
  module.directive('kcComponentConfig', (_e) => ({
    scope: {
      config: '=',
      properties: '=',
      realm: '=',
      clients: '=',
      configName: '=',
    },
    restrict: 'E',
    replace: !0,
    controller: 'ComponentConfigCtrl',
    templateUrl: `${resourceUrl}/templates/kc-component-config.html`,
  })),
  module.directive('kcSelectAction', (_e, _r) => ({
    restrict: 'A',
    compile: (e, r) => {
      for (var t = r.kcSelectAction.split(' '), n = 0; n < t.length; n++)
        e.bind(t[n], () => {
          e.select();
        });
    },
  })),
  module.filter('remove', () => (e, r, t) => {
    if (!e || !r) return e;
    for (var n = [], l = 0; l < e.length; l++) {
      var o = e[l];
      if (Array.isArray(r)) {
        for (var i = 0; i < r.length; i++)
          if (t) {
            if (r[i][t] === o[t]) {
              o = null;
              break;
            }
          } else if (r[i] === o) {
            o = null;
            break;
          }
      } else t ? r[t] === o[t] && (o = null) : r === o && (o = null);
      null != o && n.push(o);
    }
    return n;
  }),
  module.filter('capitalize', () => (e) => {
    if (e) {
      for (var r = e.split(/\s+/), t = 0; t < r.length; t++)
        r[t] = r[t].charAt(0).toUpperCase() + r[t].slice(1);
      return r.join(' ');
    }
  }),
  module.filter('toOrderedMapSortedByKey', () => (e) => {
    if (!e) return e;
    var r = Object.keys(e);
    if (r.length <= 1) return e;
    r.sort();
    for (var t = {}, n = 0; n < r.length; n++) t[r[n]] = e[r[n]];
    return t;
  }),
  module.directive('kcSidebarResize', (e) => (r, t) => {
    function n() {
      var e = angular
          .element(document.getElementsByClassName('navbar-pf'))
          .height(),
        r = angular
          .element(
            document.getElementById('view').getElementsByTagName('div')[0],
          )
          .height(),
        n = Math.max(r, window.innerHeight - e - 3);
      t[0].style['min-height'] = `${n}px`;
    }
    n();
    var l = angular.element(e);
    r.$watch(
      () => ({ h: window.innerHeight, w: window.innerWidth }),
      () => {
        n();
      },
      !0,
    ),
      l.bind('resize', () => {
        r.$apply();
      });
  }),
  module.directive('kcTooltip', (e) => ({
    restrict: 'E',
    replace: !1,
    terminal: !0,
    priority: 1e3,
    link: (r, t, _n) => {
      var l = angular.element(t[0]),
        o = l.text();
      l.text(''), t.addClass('hidden');
      var i = angular.element(t.parent().children()[0]);
      i.append(
        ` <i class="fa fa-question-circle text-muted" tooltip="${o}" tooltip-placement="right" tooltip-trigger="mouseover mouseout"></i>`,
      ),
        e(i)(r);
    },
  })),
  module.directive('kcOpen', (e) => (r, t, n) => {
    var l;
    n.$observe('kcOpen', (e) => {
      l = e;
    }),
      t.bind('click', () => {
        r.$apply(() => {
          e.path(l);
        });
      });
  }),
  module.directive(
    'kcOnReadFile',
    (e) => (
      console.debug('kcOnReadFile'),
      {
        restrict: 'A',
        scope: !1,
        link: (r, t, n) => {
          var l = e(n.kcOnReadFile);
          t.on('change', (e) => {
            var t = new FileReader();
            (t.onload = (e) => {
              r.$apply(() => {
                l(r, { $fileContent: e.target.result });
              });
            }),
              t.readAsText((e.srcElement || e.target).files[0]);
          });
        },
      }
    ),
  ),
  module.controller('PagingCtrl', (e) => {
    (e.currentPageInput = 1),
      (e.firstPage = () => {
        e.hasPrevious() && ((e.currentPage = 1), (e.currentPageInput = 1));
      }),
      (e.lastPage = () => {
        e.hasNext() &&
          ((e.currentPage = e.numberOfPages),
          (e.currentPageInput = e.numberOfPages));
      }),
      (e.previousPage = () => {
        e.hasPrevious() &&
          (e.currentPage--, (e.currentPageInput = e.currentPage));
      }),
      (e.nextPage = () => {
        e.hasNext() && (e.currentPage++, (e.currentPageInput = e.currentPage));
      }),
      (e.hasNext = () => e.currentPage < e.numberOfPages),
      (e.hasPrevious = () => e.currentPage > 1);
  }),
  module.factory('KcStrings', () => {
    var e = { endsWith: (e, r) => -1 !== e.indexOf(r, e.length - r.length) };
    return e;
  }),
  module.directive('kcPaging', () => ({
    scope: { currentPage: '=', currentPageInput: '=', numberOfPages: '=' },
    restrict: 'E',
    replace: !0,
    controller: 'PagingCtrl',
    templateUrl: `${resourceUrl}/templates/kc-paging.html`,
  })),
  module.directive('kcValidPage', () => ({
    require: 'ngModel',
    link: (e, _r, _t, n) => {
      n.$validators.inRange = (_r, t) => (
        t >= 1 && t <= e.numberOfPages && (e.currentPage = t), !0
      );
    },
  })),
  module.directive('stringToNumber', () => ({
    require: 'ngModel',
    link: (_e, _r, _t, n) => {
      n.$parsers.push((e) =>
        'undefined' === typeof e || null === e ? '' : `${e}`,
      ),
        n.$formatters.push((e) => parseFloat(e));
    },
  })),
  module.filter('startFrom', () => (e, r) => (e ? ((r = +r), e.slice(r)) : [])),
  module.directive('kcPassword', (_e, _r) => ({
    restrict: 'A',
    link: (e, r, t, _n) => {
      function l() {
        r.removeClass('password-conceal');
        var e = r.next().children().first();
        e.addClass('fa-eye-slash'), e.removeClass('fa-eye');
      }
      r.addClass('password-conceal'),
        r.attr('type', 'text'),
        r.attr('autocomplete', 'off');
      var o = r.parent(),
        i = $('<div class="input-group"></div>'),
        a = $(
          '<span class="input-group-addon btn btn-default"><span class="fa fa-eye"></span></span>',
        ).on('click', (_e) => {
          r.hasClass('password-conceal')
            ? l()
            : (() => {
                r.addClass('password-conceal');
                var e = r.next().children().first();
                e.removeClass('fa-eye-slash'), e.addClass('fa-eye');
              })();
        });
      e.$watch(t.ngModel, (e) => {
        e && '**********' === e
          ? r.next().addClass('disabled')
          : e && 0 === e.indexOf('${v')
            ? (r.next().addClass('disabled'), l())
            : r.next().removeClass('disabled');
      }),
        r.detach().appendTo(i),
        i.append(a),
        o.append(i);
    },
  })),
  module.filter('resolveClientRootUrl', () => (e) => {
    if (e)
      return e
        .replace('${authBaseUrl}', authServerUrl)
        .replace('${authAdminUrl}', authUrl);
  });
