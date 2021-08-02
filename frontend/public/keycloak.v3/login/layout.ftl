<#macro registrationLayout title="">
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
    />
    <meta name="robots" content="noindex, nofollow">
    <meta name="theme-color" content="#ffffff" />
    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <link rel="icon" href="${url.resourcesCommonPath}/img/favicon.ico" />
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="text/javascript">
    const layoutProps = {
      i18nEnabled: ${realm.internationalizationEnabled?string},
      // loginTitle: '${kcSanitize(msg("loginTitleHtml",(realm.displayNameHtml!'')))?no_esc}',
      <#if realm.internationalizationEnabled  && locale.supported?size gt 1>
        locale: {
          currentLocale: '${locale.current}',
          locales: [
            <#list locale.supported as l>
              {
                label: '${l.label}',
                url: '${l.url?no_esc}',
              },
            </#list>
          ]
        },
      </#if>
      title: '${title}',
      <#if message?has_content>
      message: {
        type: '${message.type}',
        summary: '${message.summary}',
      },
      </#if>
      <#if isAppInitiatedAction??>
      isAppInitiatedAction: ${isAppInitiatedAction?string},
      <#else>
      isAppInitiatedAction: false,
      </#if>
    };
    </script>
    <#nested "scripts">
  </body>
</html>
</#macro>
