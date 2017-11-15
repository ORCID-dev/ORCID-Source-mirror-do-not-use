<#--

    =============================================================================

    ORCID (R) Open Source
    http://orcid.org

    Copyright (c) 2012-2014 ORCID, Inc.
    Licensed under an MIT-Style License (MIT)
    http://orcid.org/open-source-license

    This copyright and license information (including a link to the full license)
    shall be included in its entirety in all copies or substantial portion of
    the software.

    =============================================================================

-->
<#include "/common/browser-checks.ftl" />
<#if ((RequestParameters['linkRequest'])?? && (RequestParameters['firstName'])?? && (RequestParameters['lastName'])?? && (RequestParameters['emailId'])??)>
	<div ng-controller="RegistrationCtrl" id="RegistrationCtr" ng-init="getRegister('${RequestParameters.firstName?js_string}', '${RequestParameters.lastName?js_string}', '${RequestParameters.emailId?js_string}', '${RequestParameters.linkRequest?js_string}')">
<#else>
	<div ng-controller="RegistrationCtrl" id="RegistrationCtr" ng-init="getRegister('', '', '', '')">
</#if>
<fn-form update-fn="postRegister()">
	<!-- span class="orcid-error" ng-show="register.errors.length > 0">
		<div ng-repeat='error in register.errors' ng-bind-html="error"></div>
   	</span -->
	<div>
        <label class="control-label">${springMacroRequestContext.getMessage("oauth_sign_up.labelfirstname")}
        </label>
        <div class="relative">
        	<#if (client_name)??>
        	<#assign js_group_name = client_group_name?replace('"', '&quot;')?js_string>
	        <#assign js_client_name = client_name?replace('"', '&quot;')?js_string>	        
        	<input type="hidden" name="client_group_name" value="${js_group_name}" />
        	<input type="hidden" name="client_name" value="${js_client_name}" />
        	<input type="hidden" name="client_id" value="${client_id}" />        	
        	</#if>
            <input name="givenNames234" type="text" tabindex="1" class="input-xlarge" ng-model="register.givenNames.value" ng-model-onblur ng-change="serverValidate('GivenNames')"/>
            <span class="required" ng-class="isValidClass(register.givenNames)">*</span>
			<div class="popover-help-container">
                <a href="javascript:void(0);"><i class="glyphicon glyphicon-question-sign"></i></a>
                <div id="name-help" class="popover bottom">
			        <div class="arrow"></div>
			        <div class="popover-content">
			            <p><@orcid.msg ''/></p>
						<p><@orcid.msg 'orcid.frontend.register.help.last_name'/></p>
						<p><@orcid.msg 'orcid.frontend.register.help.update_names'/></p>
						<a href="${knowledgeBaseUri}/articles/142948-names-in-the-orcid-registry" target="orcid.frontend.register.help.more_info.link.text"><@orcid.msg 'orcid.frontend.register.help.more_info.link.text'/></a>
			        </div>
			    </div>
            </div>
			<span class="orcid-error" ng-show="register.givenNames.errors.length > 0">
				<div ng-repeat='error in register.givenNames.errors' ng-bind-html="error"></div>
   			</span>
        </div>
    </div>				
	<div>
        <label class="control-label">${springMacroRequestContext.getMessage("oauth_sign_up.labellastname")}</label>
        <div class="relative">
            <input name="familyNames234" type="text" tabindex="2" class="input-xlarge"  ng-model="register.familyNames.value" ng-model-onblur/>
            <span class="orcid-error" ng-show="register.familyNames.errors.length > 0">
				<div ng-repeat='error in register.familyNames.errors' ng-bind-html="error"></div>
   			</span>
        </div>
    </div>
    <@orcid.checkFeatureStatus featureName='REG_MULTI_EMAIL'>
        <div>
            <label class="control-label">${springMacroRequestContext.getMessage("oauth_sign_up.labelemailprimary")}</label>
            <div class="relative">          
                <input name="emailprimary234" type="text" tabindex="3" class="input-xlarge" ng-model="register.email.value" ng-blur="serverValidate('Email')"/>
                <span class="required" ng-class="isValidClass(register.email)">*</span>
                <span class="orcid-error" ng-show="register.email.errors.length > 0 && !showDeactivatedError && !showReactivationSent">
                    <div ng-repeat='error in register.email.errors' ng-bind-html="error"></div>
                </span>
                <span class="orcid-error" ng-show="showDeactivatedError" ng-cloak>
                    ${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.1")}<a href="" ng-click="sendReactivationEmail()">${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.2")}</a>${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.3")}
                </span>
                <span class="orcid-error" ng-show="showReactivationSent" ng-cloak>
                    ${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.1")}<a href="mailto:support@orcid.org">${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.2")}</a>${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.3")}
                </span>
            </div>
        </div>  
        <div ng-repeat="emailAdditional in register.emailsAdditional track by $index">
            <label class="control-label">${springMacroRequestContext.getMessage("oauth_sign_up.labelemailadditional")}</label>
            <div class="relative">
                <input name="emailadditional234" type="text" tabindex="3" class="input-xlarge" ng-model="register.emailsAdditional[$index].value" focus-last-input="$index == focusIndex" ng-blur="serverValidate('EmailsAdditional')"/>
                <div ng-show="$first" class="popover-help-container leftBuffer">
                    <a href="javascript:void(0);"><i class="glyphicon glyphicon-question-sign"></i></a>
                    <div id="email-additional-help" class="popover bottom">
                        <div class="arrow"></div>
                        <div class="popover-content">
                            <p><@orcid.msg ''/></p>
                            <p><@orcid.msg 'orcid.frontend.register.help.email_additional'/></p>
                        </div>
                    </div>
                </div>
                <div ng-show="!$first" class="popover-help-container leftBuffer">
                    <button class="btn-white-no-border" ng-click="removeEmailField($index)"><i class="glyphicon glyphicon-remove-sign"></i></button>
                </div>
                <span class="orcid-error" ng-show="register.emailsAdditional[$index].errors.length > 0 && !showEmailsAdditionalDeactivatedError[$index] && !showEmailsAdditionalReactivationSent[$index]">
                    <div ng-repeat='error in register.emailsAdditional[$index].errors track by $index' ng-bind-html="error"></div>
                </span>
                <span class="orcid-error" ng-show="showEmailsAdditionalDeactivatedError[$index]" ng-cloak>
                    ${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.1")}<a href="" ng-click="sendEmailsAdditionalReactivationEmail($index)">${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.2")}</a>${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.3")}
                </span>
                <span class="orcid-error" ng-show="showEmailsAdditionalReactivationSent[$index]" ng-cloak>
                    ${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.1")}<a href="mailto:support@orcid.org">${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.2")}</a>${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.3")}
                </span>
            </div>
        </div>
        <button ng-click="addEmailField()" class="btn-white-no-border"><i class="glyphicon glyphicon-plus-sign"></i> ${springMacroRequestContext.getMessage("oauth_sign_up.buttonaddemail")}</button>
    </@orcid.checkFeatureStatus>
    <@orcid.checkFeatureStatus featureName='REG_MULTI_EMAIL' enabled=false>	
        <div>
            <label class="control-label">${springMacroRequestContext.getMessage("oauth_sign_up.labelemail")}</label>
            <div class="relative">          
                <input name="email234" type="text" tabindex="3" class="input-xlarge" ng-model="register.email.value" ng-blur="serverValidate('Email')"/>
                <span class="required" ng-class="isValidClass(register.email)">*</span>
                <span class="orcid-error" ng-show="register.email.errors.length > 0 && !showDeactivatedError && !showReactivationSent">
                    <div ng-repeat='error in register.email.errors' ng-bind-html="error"></div>
                </span>
                <span class="orcid-error" ng-show="showDeactivatedError" ng-cloak>
                    ${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.1")}<a href="" ng-click="sendReactivationEmail()">${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.2")}</a>${springMacroRequestContext.getMessage("orcid.frontend.verify.deactivated_email.3")}
                </span>
                <span class="orcid-error" ng-show="showReactivationSent" ng-cloak>
                    ${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.1")}<a href="mailto:support@orcid.org">${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.2")}</a>${springMacroRequestContext.getMessage("orcid.frontend.verify.reactivation_sent.3")}
                </span>
            </div>
        </div>		
        <div>
            <label class="control-label">${springMacroRequestContext.getMessage("oauth_sign_up.labelreenteremail")}</label>
            <div class="relative">
                <input name="confirmedEmail234" type="email" tabindex="4" class="input-xlarge" ng-model="register.emailConfirm.value" ng-model-onblur />
                <span class="required" ng-class="isValidClass(register.emailConfirm)">*</span>
                <span class="orcid-error" ng-show="register.emailConfirm.errors.length > 0 && !showDeactivatedError && !showReactivationSent">
    				<div ng-repeat='error in register.emailConfirm.errors' ng-bind-html="error"></div>
       			</span>
            </div>
        </div>	
    </@orcid.checkFeatureStatus>			
    <div class="control-group">
        <label class="control-label">${springMacroRequestContext.getMessage("oauth_sign_up.labelpassword")}</label>
        <div class="relative">
            <input type="password" name="password" tabindex="5" class="input-xlarge" ng-model="register.password.value" ng-change="serverValidate('Password')"/>
            <span class="required" ng-class="isValidClass(register.password)">*</span>
   			<@orcid.passwordHelpPopup />
            <span class="orcid-error" ng-show="register.password.errors.length > 0">
				<div ng-repeat='error in register.password.errors' ng-bind-html="error"></div>
   			</span>
        </div>
    </div>
    <div>
        <label class="control-label">${springMacroRequestContext.getMessage("password_one_time_reset.labelconfirmpassword")}</label>
        <div class="relative">
            <input type="password" name="confirmPassword" tabindex="6" class="input-xlarge" ng-model="register.passwordConfirm.value" ng-change="serverValidate('PasswordConfirm')"/>
            <span class="required" ng-class="isValidClass(register.passwordConfirm)">*</span>
            <span class="orcid-error" ng-show="register.passwordConfirm.errors.length > 0">
				<div ng-repeat='error in register.passwordConfirm.errors' ng-bind-html="error"></div>
   			</span>
        </div>
    </div>
	<div style="margin-bottom: 20px; margin-top: 10px;">
        <label class="privacy-toggle-lbl">${springMacroRequestContext.getMessage("privacy_preferences.activitiesVisibilityDefault")}</label> 
        <label class="privacy-toggle-lbl">${springMacroRequestContext.getMessage("privacy_preferences.activitiesVisibilityDefault.who_can_see_this")}</label>
    	<@orcid.privacyToggle 
    	    angularModel="register.activitiesVisibilityDefault.visibility" 
    	    questionClick="toggleClickPrivacyHelp('workPrivHelp')"
			clickedClassCheck="{'popover-help-container-show':privacyHelp['workPrivHelp']==true}" 
			publicClick="updateActivitiesVisibilityDefault('PUBLIC', $event)"
			limitedClick="updateActivitiesVisibilityDefault('LIMITED', $event)"
			privateClick="updateActivitiesVisibilityDefault('PRIVATE', $event)" />
    </div>                    
    <div>
        <div class="relative">
            <@orcid.registrationEmailFrequencySelector angularElementName="register" />
         </div>
	</div>
    <div>
        <div class="relative recaptcha"  id="recaptcha" style="margin-bottom: 15px;">			
			 <div
                vc-recaptcha
                theme="'light'"
                key="model.key"
                on-create="setRecaptchaWidgetId(widgetId)"
                on-success="setRecatchaResponse(response)"
            ></div>
            <span class="orcid-error" ng-show="register.grecaptcha.errors.length > 0">
				<div ng-repeat='error in register.grecaptcha.errors track by $index' ng-bind-html="error"></div>
   			</span>
        </div>
	</div>   
    <div>
        <div class="relative"  style="margin-bottom: 15px;">
            <label class="dark-label">${springMacroRequestContext.getMessage("register.labelTermsofUse")} <span class="required"  ng-class="{'text-error':register.termsOfUse.value == false}">*</span></label>
            <div class="checkbox">
	            <label class="checkbox dark-label">            
	            	<input type="checkbox" tabindex="9" name="acceptTermsAndConditions" ng-model="register.termsOfUse.value" ng-change="serverValidate('TermsOfUse')" />
	            	${springMacroRequestContext.getMessage("register.labelconsent")} <a href="${aboutUri}/footer/privacy-policy" target="register.labelprivacypolicy">${springMacroRequestContext.getMessage("register.labelprivacypolicy")}</a> ${springMacroRequestContext.getMessage("register.labeland")}  ${springMacroRequestContext.getMessage("common.termsandconditions1")}<a href="${aboutUri}/content/orcid-terms-use" target="common.termsandconditions2">${springMacroRequestContext.getMessage("common.termsandconditions2")}</a> ${springMacroRequestContext.getMessage("common.termsandconditions3")}
	            </label>
	        </div>
            
            <span class="orcid-error" ng-show="register.termsOfUse.errors.length > 0">
				<div ng-repeat='error in register.termsOfUse.errors' ng-bind-html="error"></div>
   			</span>
        </div>
	</div>  
	<div ng-show="generalRegistrationError != null">
        <div class="relative"  style="margin-bottom: 15px;">
        	<div class="col-sm-12">
        		<span class="orcid-error" ng-bind-html="generalRegistrationError"></span>
        	</div>
        </div>
	</div>	 
    <div class="relative">
    	<#if (RequestParameters['linkRequest'])??>
			<button type="submit" tabindex="10" class="btn btn-primary" ng-click="postRegister('${RequestParameters.linkRequest}')">${springMacroRequestContext.getMessage("header.register")}</button>
		<#else>
			<button type="submit" tabindex="10" class="btn btn-primary" ng-click="postRegister(null)">${springMacroRequestContext.getMessage("header.register")}</button>
		</#if>
    </div>  
</fn-form>

<@orcid.checkFeatureStatus featureName='HTTPS_IDS'>
    <script type="text/ng-template" id="duplicates">
    	<div class="lightbox-container" id="duplicates-records">
    		<div class="row margin-top-box">			
    			<div class="col-md-6 col-sm-6 col-xs-12">
    	     		<h4>${springMacroRequestContext.getMessage("duplicate_researcher.wefoundfollowingrecords")}
    	     		${springMacroRequestContext.getMessage("duplicate_researcher.to_access.1")}
    	     		    <#if request.requestURI?ends_with("/oauth/signin")>
    	     		        <a href="javascript:$.colorbox.close()">
    	     		    <#else>
    	     		        <a href="<@orcid.rootPath "/signin" />" target="signin">
    	     		    </#if>
    	     		    ${springMacroRequestContext.getMessage("duplicate_researcher.to_access.2")}</a>${springMacroRequestContext.getMessage("duplicate_researcher.to_access.3")}
    	     		</h4>
         		</div>
         		<div class="col-md-6 col-sm-6 col-xs-12 right margin-top-box">
    	     	    <button class="btn btn-primary" ng-click="postRegisterConfirm()">${springMacroRequestContext.getMessage("duplicate_researcher.btncontinuetoregistration")}</button>
    			</div>
    		</div>				
    		<div class="row">
    			<div class="col-sm-12">
    				<table class="table">
                        <thead>
                            <tr>                      
                                <th><@orcid.msg 'search_results.thORCIDID'/></th>
                                <th><@orcid.msg 'duplicate_researcher.thEmail'/></th>
                                <th><@orcid.msg 'duplicate_researcher.thgivennames'/></th>
                                <th><@orcid.msg 'duplicate_researcher.thFamilyName'/></th>
                                <@orcid.checkFeatureStatus featureName='SEARCH_RESULTS_AFFILIATIONS'> 
                                    <th><@orcid.msg 'workspace_bio.Affiliations'/></th>
                                </@orcid.checkFeatureStatus>
                                <@orcid.checkFeatureStatus featureName='SEARCH_RESULTS_AFFILIATIONS' enabled=false> 
                                    <th><@orcid.msg 'duplicate_researcher.thInstitution'/></th>
                                </@orcid.checkFeatureStatus>                   
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat='dup in duplicates'>
                                <td><a href="${baseUri}/{{dup.orcid}}" target="dup.orcid">${baseUri}/{{dup.orcid}}</a></td>
                                <td>{{dup.email}}</td>
                                <td>{{dup.givenNames}}</td>
                                <td>{{dup.familyNames}}</td>
                                <@orcid.checkFeatureStatus featureName='SEARCH_RESULTS_AFFILIATIONS'> 
                                    <td ng-bind="getAffiliations(dup)">{{dup['institution']}}</td>
                                </@orcid.checkFeatureStatus> 
                                <@orcid.checkFeatureStatus featureName='SEARCH_RESULTS_AFFILIATIONS' enabled=false> 
                                    <td>{{dup.institution}}</td>
                                </@orcid.checkFeatureStatus>  
                            </tr>
                        </tbody>
                    </table>
    			</div>
    		</div>	
    		<div class="row margin-top-box">
    			<div class="col-md-12 col-sm-12 col-xs-12 right">
    		    	<button class="btn btn-primary" ng-click="postRegisterConfirm()">${springMacroRequestContext.getMessage("duplicate_researcher.btncontinuetoregistration")}</button>
    			</div>
    		</div>
    	</div>
    </script> 
</@orcid.checkFeatureStatus> 
<@orcid.checkFeatureStatus featureName='HTTPS_IDS' enabled=false> 
    <script type="text/ng-template" id="duplicates">
        <div class="lightbox-container" id="duplicates-records">
            <div class="row margin-top-box">            
                <div class="col-md-6 col-sm-6 col-xs-12">
                    <h4>${springMacroRequestContext.getMessage("duplicate_researcher.wefoundfollowingrecords")}
                    ${springMacroRequestContext.getMessage("duplicate_researcher.to_access.1")}
                        <#if request.requestURI?ends_with("/oauth/signin")>
                            <a href="javascript:$.colorbox.close()">
                        <#else>
                            <a href="<@orcid.rootPath "/signin" />" target="signin">
                        </#if>
                        ${springMacroRequestContext.getMessage("duplicate_researcher.to_access.2")}</a>${springMacroRequestContext.getMessage("duplicate_researcher.to_access.3")}
                    </h4>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12 right margin-top-box">
                    <button class="btn btn-primary" ng-click="postRegisterConfirm()">${springMacroRequestContext.getMessage("duplicate_researcher.btncontinuetoregistration")}</button>
                </div>
            </div>              
            <div class="row">
                <div class="col-sm-12">
                    <table class="table">
                        <thead>
                            <tr>                      
                                <th><@orcid.msg 'search_results.thORCIDID'/></th>
                                <th><@orcid.msg 'duplicate_researcher.thEmail'/></th>
                                <th><@orcid.msg 'duplicate_researcher.thgivennames'/></th>
                                <th><@orcid.msg 'duplicate_researcher.thFamilyName'/></th>
                                <@orcid.checkFeatureStatus featureName='SEARCH_RESULTS_AFFILIATIONS'> 
                                    <th><@orcid.msg 'workspace_bio.Affiliations'/></th>
                                </@orcid.checkFeatureStatus>
                                <@orcid.checkFeatureStatus featureName='SEARCH_RESULTS_AFFILIATIONS' enabled=false> 
                                    <th><@orcid.msg 'duplicate_researcher.thInstitution'/></th>
                                </@orcid.checkFeatureStatus>                   
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat='dup in duplicates'>
                                <td><a href="${baseUri}/{{dup.orcid}}" target="dup.orcid">${baseUri}/{{dup.orcid}}</a></td>
                                <td>{{dup.email}}</td>
                                <td>{{dup.givenNames}}</td>
                                <td>{{dup.familyNames}}</td>
                                <@orcid.checkFeatureStatus featureName='SEARCH_RESULTS_AFFILIATIONS'> 
                                    <td ng-bind="getAffiliations(dup)">{{dup['institution']}}</td>
                                </@orcid.checkFeatureStatus> 
                                <@orcid.checkFeatureStatus featureName='SEARCH_RESULTS_AFFILIATIONS' enabled=false> 
                                    <td>{{dup.institution}}</td>
                                </@orcid.checkFeatureStatus>  
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>  
            <div class="row margin-top-box">
                <div class="col-md-12 col-sm-12 col-xs-12 right">
                    <button class="btn btn-primary" ng-click="postRegisterConfirm()">${springMacroRequestContext.getMessage("duplicate_researcher.btncontinuetoregistration")}</button>
                </div>
            </div>
        </div>
    </script> 
</@orcid.checkFeatureStatus>        
</div>
