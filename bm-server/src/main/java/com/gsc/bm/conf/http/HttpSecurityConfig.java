package com.gsc.bm.conf.http;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class HttpSecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    private final Environment environment;

    public HttpSecurityConfig(Environment environment) {
        this.environment = environment;
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        String username = environment.getProperty("http-auth.username");
        String password = environment.getProperty("http-auth.password");
        if ((username == null) != (password == null)) {
            throw new IllegalStateException("Configure both HTTP Basic username and encoded password, or neither");
        }
        // No default administrative credentials. Authorization policy remains I06/I20.
        var users = auth.inMemoryAuthentication();
        if (username != null) {
            users.withUser(username).password(password).roles("ADMIN");
        }
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.httpBasic().and().cors().and().csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .antMatchers(org.springframework.http.HttpMethod.POST, "/rest/v1/logs/client/web/").permitAll()
                .antMatchers("/rest/v1/logs/**").hasRole("ADMIN")
                .antMatchers("/rest/v1/sign-in/**", "/rest/v1/sign-up/**", "/ws/v1/**", "/error").permitAll()
                .anyRequest().denyAll();
    }

}

