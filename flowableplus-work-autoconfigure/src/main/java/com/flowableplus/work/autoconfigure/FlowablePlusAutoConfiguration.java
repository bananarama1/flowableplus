package com.flowableplus.work.autoconfigure;

import org.flowable.engine.IdentityService;
import org.flowable.engine.RepositoryService;
import org.flowable.app.api.AppRepositoryService;
import org.flowable.idm.api.User;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.core.userdetails.User.withUsername;

@AutoConfiguration
@EnableConfigurationProperties({ FlowablePlusProperties.class, FlowablePlusTestingProperties.class })
public class FlowablePlusAutoConfiguration {

	@Bean
	@ConditionalOnProperty(prefix = "flowableplus.testing", name = "enabled", havingValue = "true")
	FlowablePlusTestDeploymentController flowablePlusTestDeploymentController(AppRepositoryService appRepositoryService) {
		return new FlowablePlusTestDeploymentController(appRepositoryService);
	}

	@Bean
	@ConditionalOnMissingBean
	SecurityFilterChain flowablePlusSecurity(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
		http.authorizeHttpRequests(requests -> requests
				.requestMatchers("/login", "/css/**", "/js/**").permitAll()
				.anyRequest().authenticated())
			.csrf(csrf -> csrf.ignoringRequestMatchers("/plus/test/app-deployments/**"))
			.authenticationProvider(authenticationProvider)
			.httpBasic(httpBasic -> {})
			.formLogin(form -> form.permitAll())
			.logout(logout -> logout.permitAll());
		return http.build();
	}

	@Bean
	@ConditionalOnMissingBean(AuthenticationProvider.class)
	AuthenticationProvider flowablePlusAuthenticationProvider(UserDetailsService userDetailsService,
			PasswordEncoder passwordEncoder) {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}

	@Bean
	@ConditionalOnMissingBean(PasswordEncoder.class)
	PasswordEncoder flowablePlusPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	@ConditionalOnMissingBean(UserDetailsService.class)
	UserDetailsService flowablePlusUsers(FlowablePlusProperties properties, PasswordEncoder passwordEncoder) {
		return new InMemoryUserDetailsManager(withUsername(properties.getUsername())
				.password(passwordEncoder.encode(properties.getPassword()))
				.roles("USER")
				.build());
	}

	@Bean
	CommandLineRunner flowablePlusIdentity(IdentityService identityService, FlowablePlusProperties properties) {
		return args -> {
			User user = identityService.createUserQuery()
					.userId(properties.getUsername())
					.singleResult();
			if (user == null) {
				user = identityService.newUser(properties.getUsername());
				user.setFirstName("Demo");
				user.setLastName("User");
				identityService.saveUser(user);
			}
		};
	}

	@Bean
	CommandLineRunner flowablePlusProcessDeployment(RepositoryService repositoryService,
			AppRepositoryService appRepositoryService,
			FlowablePlusTestingProperties testingProperties) {
		return args -> {
			if (testingProperties.isSkipDefaultDeployment()) {
				return;
			}
			if (repositoryService.createProcessDefinitionQuery()
					.processDefinitionKey("simpleApprovalProcess")
					.latestVersion()
					.count() == 0) {
				appRepositoryService.createDeployment()
						.name("Flowable Plus simple approval app")
						.addClasspathResource("flowablePlus/apps/simple-approval/app-simple-process.bpmn20.xml")
						.addClasspathResource("flowablePlus/apps/simple-approval/app-simple-approval-process.bpmn20.xml")
						.addClasspathResource("flowablePlus/apps/simple-approval/app-simple-case.cmmn")
						.deploy();
			}
		};
	}
}
