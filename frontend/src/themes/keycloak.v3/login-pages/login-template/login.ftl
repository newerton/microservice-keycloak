<#import "layout.ftl" as layout>
<@layout.registrationLayout title=msg("doLogIn"); section>
    <#if section = "scripts">
      <script type="text/javascript">
        const pageProps = {
            loginEnabled: ${realm.password?string},
            loginAction: '${url.loginAction?no_esc}',
            <#if usernameEditDisabled??>
            usernameEditDisabled: true,
            <#else>
            usernameEditDisabled: false,
            </#if>
            <#if !realm.loginWithEmailAllowed>
            usernameLabel: '${msg("username")}',
            <#elseif !realm.registrationEmailAsUsername>
            usernameLabel: '${msg("usernameOrEmail")}',
            <#else>
            usernameLabel: '${msg("email")}',
            </#if>
            passwordLabel: '${msg("password")}',
            <#if messagesPerField.existsError('username','password')>
            userNameExistsError: true,
            usernameError: "${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}",
            <#else>
            userNameExistsError: false,
            usernameError: '',
            </#if>
            usernameValue: '${(login.username!'')}',
            enabledRememberMe: ${realm.rememberMe?string},
            <#if login.rememberMe??>
            enabledLoginRememberMe: ${login.rememberMe?string},
            </#if>
            rememberMeLabel: '${msg("rememberMe")}',
            resetPasswordAllowed: ${realm.resetPasswordAllowed?string},
            resetPasswordUrl: '${url.loginResetCredentialsUrl?no_esc}',
            resetPasswordLabel: '${msg("doForgotPassword")}',
            registrationAllowed: ${realm.registrationAllowed?string},
            registrationNoAccount: '${msg("noAccount")}',
            registrationUrl: '${url.registrationUrl?no_esc}',
            registrationLabel: '${msg("doRegister")}',
            selectedCredential: '<#if auth.selectedCredential?has_content>${auth.selectedCredential}</#if>',
            loginLabel: '${msg("doLogIn")}',
            <#if realm.password && social.providers??>
            socialProviders: [
              <#list social.providers as p>
              {
                loginUrl: '${p.loginUrl?no_esc}',
                alias: '${p.alias}',
                providerId: '${p.providerId}',
                displayName: '${p.displayName}',
              },
              </#list>
            ],
        </#if>
        };
      </script>
      <%= htmlWebpackPlugin.tags.bodyTags %>
    </#if>
</@layout.registrationLayout>
