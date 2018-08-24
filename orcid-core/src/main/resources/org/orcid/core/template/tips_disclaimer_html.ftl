<#import "email_macros.ftl" as emailMacros />
<#escape x as x?html>
<p style="font-family: arial, helvetica, sans-serif; font-size: 15px; color: #494A4C;">
<small>

<@emailMacros.msg "tips.disclaimer.1" /> <a href="${unsubscribeLink}" target="_blank"><@emailMacros.msg "tips.disclaimer.1.url.text" /></a> <@emailMacros.msg "tips.disclaimer.2" /> <a href="https://support.orcid.org/knowledgebase/articles/1807645-notifications-preferences#02-tips" target="_blank"><@emailMacros.msg "tips.disclaimer.2.url.text" /></a>
</p>
</#escape>