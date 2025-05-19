package com.MikeCom.SystheseP;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class SysthesePApplication implements CommandLineRunner {


	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.load();
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(SysthesePApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

	}
}
