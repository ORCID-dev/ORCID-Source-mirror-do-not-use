package org.orcid.api.common.security.oauth;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.orcid.core.locale.LocaleManager;
import org.orcid.core.security.MethodNotAllowedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.security.oauth2.provider.client.ClientCredentialsTokenEndpointFilter;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Declan Newman (declan) Date: 08/05/2012
 */
public class OrcidOauth2TokenEndPointFilter extends ClientCredentialsTokenEndpointFilter {

    private final static String PUBLIC_ROLE = "ROLE_PUBLIC";
    
    @Resource
    private LocaleManager localeManager;

    private OrcidOauth2TokenEndPointFilter() {
        super();
    }

    private OrcidOauth2TokenEndPointFilter(String path) {
        super(path);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        if (request.getMethod().equals(RequestMethod.GET.name())) {
            InvalidRequestException ire = new InvalidRequestException(localeManager.resolveMessage("apiError.token_request_callmethod.exception"));
            throw new MethodNotAllowedException(localeManager.resolveMessage("apiError.token_request_callmethod.exception"), ire);
        }

        String clientId = request.getParameter("client_id");
        String clientSecret = request.getParameter("client_secret");

        // If the request is already authenticated we can assume that this
        // filter is not needed
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication;
        }

        if (clientId == null) {
            throw new BadCredentialsException(localeManager.resolveMessage("apiError.client_credentials.exception"));
        }

        if (clientSecret == null) {
            clientSecret = "";
        }

        clientId = clientId.trim();
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(clientId, "{noop}"+clientSecret);

        authentication = this.getAuthenticationManager().authenticate(authRequest);

        if (authentication != null) {
            for (GrantedAuthority auth : authentication.getAuthorities()) {
                if (PUBLIC_ROLE.equals(auth.getAuthority())) {
                    InvalidRequestException ire = new InvalidRequestException(localeManager.resolveMessage("apiError.memberapi_access.exception"));
                    throw new MethodNotAllowedException(localeManager.resolveMessage("apiError.memberapi_access.exception"), ire);
                }
            }
        }

        return authentication;
    }

}
