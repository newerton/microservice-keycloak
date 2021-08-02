<#macro registrationLayout>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
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
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <link rel="icon" href="${url.resourcesCommonPath}/img/favicon.ico" />
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">
      <#nested "child">
    </div>
  </body>
</html>
</#macro>
