package com.MikeCom.SystheseP.model;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void getIdAndSetId() {
        User user = new User();
        user.setId(1L);
        assertEquals(1L, user.getId());
    }

    @Test
    void getFirstNameAndSetFirstName() {
        User user = new User();
        user.setFirstName("Mike");
        assertEquals("Mike", user.getFirstName());
    }

    @Test
    void getLastNameAndSetLastName() {
        User user = new User();
        user.setLastName("Com");
        assertEquals("Com", user.getLastName());
    }

    @Test
    void getEmailAndSetEmail() {
        User user = new User();
        user.setEmail("mike@test.com");
        assertEquals("mike@test.com", user.getEmail());
    }

    @Test
    void getPhoneNumberAndSetPhoneNumber() {
        User user = new User();
        user.setPhoneNumber("5141234567");
        assertEquals("5141234567", user.getPhoneNumber());
    }

    @Test
    void getAddressAndSetAddress() {
        User user = new User();
        user.setAddress("123 Rue de Montréal");
        assertEquals("123 Rue de Montréal", user.getAddress());
    }

    @Test
    void setPasswordAndGetPassword() {
        User user = new User();
        user.setPassword("secure123");
        assertEquals("secure123", user.getPassword());
    }

    @Test
    void getRoleAndSetRole() {
        User user = new User();
        user.setRole(Role.ADMIN);
        assertEquals(Role.ADMIN, user.getRole());
    }

    @Test
    void getAuthorities_shouldReturnCorrectAuthority() {
        User user = new User();
        user.setRole(Role.USER);
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        assertEquals(1, authorities.size());
        assertEquals("USER", authorities.iterator().next().getAuthority());
    }

    @Test
    void getUsername_shouldReturnEmail() {
        User user = new User();
        user.setEmail("test@example.com");
        assertEquals("test@example.com", user.getUsername());
    }

    @Test
    void isAccountNonExpired_shouldReturnTrue() {
        User user = new User();
        assertTrue(user.isAccountNonExpired());
    }

    @Test
    void isAccountNonLocked_shouldReturnTrue() {
        User user = new User();
        assertTrue(user.isAccountNonLocked());
    }

    @Test
    void isCredentialsNonExpired_shouldReturnTrue() {
        User user = new User();
        assertTrue(user.isCredentialsNonExpired());
    }

    @Test
    void isEnabled_shouldReturnTrue() {
        User user = new User();
        assertTrue(user.isEnabled());
    }

    @Test
    void testToString_shouldContainAllFields() {
        User user = new User.Builder()
                .id(1L)
                .firstName("Mike")
                .lastName("Com")
                .email("mike@example.com")
                .password("pass123")
                .phoneNumber("5141112222")
                .address("Rue du Test")
                .role(Role.USER)
                .build();

        String result = user.toString();

        assertTrue(result.contains("Mike"));
        assertTrue(result.contains("Com"));
        assertTrue(result.contains("mike@example.com"));
        assertTrue(result.contains("pass123"));
        assertTrue(result.contains("5141112222"));
        assertTrue(result.contains("Rue du Test"));
        assertTrue(result.contains("USER"));
    }
}
