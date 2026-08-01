var module = angular.module('keycloak.loaders', [
  'keycloak.services',
  'ngResource',
]);
module.factory('Loader', (r) => {
  var e = {
    get: (e, n) => () => {
      var t = n?.(),
        a = r.defer();
      return (
        e.get(
          t,
          (r) => {
            a.resolve(r);
          },
          () => {
            a.reject(`Unable to fetch ${t}`);
          },
        ),
        a.promise
      );
    },
    query: (e, n) => () => {
      var t = n?.(),
        a = r.defer();
      return (
        e.query(
          t,
          (r) => {
            a.resolve(r);
          },
          () => {
            a.reject(`Unable to fetch ${t}`);
          },
        ),
        a.promise
      );
    },
  };
  return e;
}),
  module.factory('RealmListLoader', (r, e, _n) => r.get(e)),
  module.factory('ServerInfoLoader', (_r, e) => () => e.promise),
  module.factory('RealmLoader', (r, e, n, _t) =>
    r.get(e, () => ({ id: n.current.params.realm })),
  ),
  module.factory('RealmKeysLoader', (r, e, n, _t) =>
    r.get(e, () => ({ id: n.current.params.realm })),
  ),
  module.factory('RealmSpecificLocalesLoader', (r, e, n, _t) =>
    r.get(e, () => ({ id: n.current.params.realm })),
  ),
  module.factory('RealmSpecificlocalizationTextLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      locale: n.current.params.locale,
      key: n.current.params.key,
    })),
  ),
  module.factory('RealmEventsConfigLoader', (r, e, n, _t) =>
    r.get(e, () => ({ id: n.current.params.realm })),
  ),
  module.factory('UserListLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('RequiredActionsListLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('UnregisteredRequiredActionsListLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('RealmSessionStatsLoader', (r, e, n, _t) =>
    r.get(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('RealmClientSessionStatsLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('ClientProtocolMapperLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
      id: n.current.params.id,
    })),
  ),
  module.factory('ClientScopeProtocolMapperLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      clientScope: n.current.params.clientScope,
      id: n.current.params.id,
    })),
  ),
  module.factory('UserLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      userId: n.current.params.user,
    })),
  ),
  module.factory('ComponentLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      componentId: n.current.params.componentId,
    })),
  ),
  module.factory('LDAPMapperLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      componentId: n.current.params.mapperId,
    })),
  ),
  module.factory('ComponentsLoader', (r, e, n, _t) => {
    var a = {
      loadComponents: (t, a) =>
        r.query(e, () => ({
          realm: n.current.params.realm,
          parent: t,
          type: a,
        }))(),
    };
    return a;
  }),
  module.factory('SubComponentTypesLoader', (r, e, n, _t) => {
    var a = {
      loadComponents: (t, a) =>
        r.query(e, () => ({
          realm: n.current.params.realm,
          componentId: t,
          type: a,
        }))(),
    };
    return a;
  }),
  module.factory('UserSessionStatsLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      user: n.current.params.user,
    })),
  ),
  module.factory('UserSessionsLoader', (r, e, n, _t) =>
    r.query(e, () => ({
      realm: n.current.params.realm,
      user: n.current.params.user,
    })),
  ),
  module.factory('UserOfflineSessionsLoader', (r, e, n, _t) =>
    r.query(e, () => ({
      realm: n.current.params.realm,
      user: n.current.params.user,
      client: n.current.params.client,
    })),
  ),
  module.factory('UserFederatedIdentityLoader', (r, e, n, _t) =>
    r.query(e, () => ({
      realm: n.current.params.realm,
      user: n.current.params.user,
    })),
  ),
  module.factory('UserConsentsLoader', (r, e, n, _t) =>
    r.query(e, () => ({
      realm: n.current.params.realm,
      user: n.current.params.user,
    })),
  ),
  module.factory('RoleLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      role: n.current.params.role,
    })),
  ),
  module.factory('RoleListLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('ClientRoleLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
      role: n.current.params.role,
    })),
  ),
  module.factory('ClientSessionStatsLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
    })),
  ),
  module.factory('ClientSessionCountLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
    })),
  ),
  module.factory('ClientOfflineSessionCountLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
    })),
  ),
  module.factory('ClientDefaultClientScopesLoader', (r, e, n, _t) =>
    r.query(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
    })),
  ),
  module.factory('ClientOptionalClientScopesLoader', (r, e, n, _t) =>
    r.query(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
    })),
  ),
  module.factory('ClientLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
    })),
  ),
  module.factory('ClientListLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm, first: 0, max: 20 })),
  ),
  module.factory('ClientScopeLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      clientScope: n.current.params.clientScope,
    })),
  ),
  module.factory('ClientScopeListLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('RealmDefaultClientScopesLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('RealmOptionalClientScopesLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('ClientServiceAccountUserLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      client: n.current.params.client,
    })),
  ),
  module.factory('RoleMappingLoader', (r, e, n, _t) => {
    var a = n.current.params.realm || n.current.params.client;
    return r.query(e, () => ({ realm: a, role: n.current.params.role }));
  }),
  module.factory('IdentityProviderLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      alias: n.current.params.alias,
    })),
  ),
  module.factory('IdentityProviderFactoryLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      provider_id: n.current.params.provider_id,
    })),
  ),
  module.factory('IdentityProviderMapperTypesLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      alias: n.current.params.alias,
    })),
  ),
  module.factory('IdentityProviderMappersLoader', (r, e, n, _t) =>
    r.query(e, () => ({
      realm: n.current.params.realm,
      alias: n.current.params.alias,
    })),
  ),
  module.factory('IdentityProviderMapperLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      alias: n.current.params.alias,
      mapperId: n.current.params.mapperId,
    })),
  ),
  module.factory('AuthenticationFlowsLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm, flow: '' })),
  ),
  module.factory('AuthenticationFormProvidersLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('AuthenticationFormActionProvidersLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('AuthenticatorProvidersLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('ClientAuthenticatorProvidersLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('AuthenticationFlowLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      flow: n.current.params.flow,
    })),
  ),
  module.factory('AuthenticationConfigDescriptionLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      provider: n.current.params.provider,
    })),
  ),
  module.factory(
    'PerClientAuthenticationConfigDescriptionLoader',
    (r, e, n, _t) => r.get(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory(
    'ExecutionIdLoader',
    (r) => () => r.current.params.executionId,
  ),
  module.factory('AuthenticationConfigLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      config: n.current.params.config,
    })),
  ),
  module.factory('GroupListLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('GroupCountLoader', (r, e, n, _t) =>
    r.query(e, () => ({ realm: n.current.params.realm, top: !0 })),
  ),
  module.factory('GroupLoader', (r, e, n, _t) =>
    r.get(e, () => ({
      realm: n.current.params.realm,
      groupId: n.current.params.group,
    })),
  ),
  module.factory('ClientInitialAccessLoader', (r, e, n) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  ),
  module.factory('ClientRegistrationPolicyProvidersLoader', (r, e, n) =>
    r.query(e, () => ({ realm: n.current.params.realm })),
  );
