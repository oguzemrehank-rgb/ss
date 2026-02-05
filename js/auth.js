// Auth JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const countryCode = document.getElementById('country-code').value;
            const phone = countryCode + document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const captcha = document.getElementById('captcha').checked;
            
            if (password !== confirmPassword) {
                alert('Şifreler eşleşmiyor.');
                return;
            }
            
            if (!captcha) {
                alert('Lütfen "Kesinlikle robot değilim" kutusunu işaretleyin.');
                return;
            }
            
            if (registerUser(username, email, phone, password)) {
                alert('Kayıt başarılı! Giriş yapabilirsiniz.');
                window.location.href = 'giris.html';
            } else {
                alert('Bu e-posta zaten kayıtlı.');
            }
        });
        
        // Password toggle
        const togglePassword = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });
        
        const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
            confirmPasswordInput.type = type;
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const loginTypeSelect = document.getElementById('login-type');
        const emailGroup = document.getElementById('email-group');
        const phoneGroup = document.getElementById('phone-group');
        
        loginTypeSelect.addEventListener('change', function() {
            if (this.value === 'email') {
                emailGroup.style.display = 'block';
                phoneGroup.style.display = 'none';
                document.getElementById('email').required = true;
                document.getElementById('phone').required = false;
            } else {
                emailGroup.style.display = 'none';
                phoneGroup.style.display = 'block';
                document.getElementById('email').required = false;
                document.getElementById('phone').required = true;
            }
        });
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const loginType = loginTypeSelect.value;
            let identifier, password;
            if (loginType === 'email') {
                identifier = document.getElementById('email').value;
            } else {
                const countryCode = document.getElementById('country-code').value;
                identifier = countryCode + document.getElementById('phone').value;
            }
            password = document.getElementById('password').value;
            
            if (loginUser(identifier, password, loginType)) {
                window.location.href = 'index.html';
            } else {
                alert('Geçersiz giriş bilgileri.');
            }
        });
    }
    
    // Profile page
    if (window.location.pathname.includes('hesabim.html')) {
        loadProfile();
        
        // Profil resmi değiştirme
        const changeProfileImageBtn = document.getElementById('change-profile-image-btn');
        const profileImageInput = document.getElementById('profile-image-input');
        const profileImage = document.getElementById('profile-image');
        
        changeProfileImageBtn.addEventListener('click', function() {
            profileImageInput.click();
        });
        
        profileImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageData = e.target.result;
                    profileImage.src = imageData;
                    updateProfile({ profileImage: imageData });
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.getElementById('edit-profile-btn').addEventListener('click', function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const newUsername = prompt('Yeni kullanıcı adı:', currentUser.username);
            const newDescription = prompt('Yeni açıklama:', currentUser.description || '');
            if (newUsername || newDescription) {
                updateProfile({ username: newUsername || currentUser.username, description: newDescription });
                loadProfile();
            }
        });
        
        document.getElementById('delete-account-btn').addEventListener('click', function() {
            if (confirm('Hesabınızı silmek istediğinizden emin misiniz?')) {
                deleteAccount();
                window.location.href = 'index.html';
            }
        });
    }
});

function registerUser(username, email, phone, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.email === email)) {
        return false;
    }
    users.push({ username, email, phone, password, description: '' });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function loginUser(identifier, password, type = 'email') {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => {
        if (type === 'email') {
            return user.email === identifier && user.password === password;
        } else {
            return user.phone === identifier && user.password === password;
        }
    });
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function updateProfile(updates) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
}

function deleteAccount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.filter(user => user.email !== currentUser.email);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem('currentUser');
}

function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('profile-username').textContent = currentUser.username || currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-phone').textContent = currentUser.phone || 'Belirtilmemiş';
        document.getElementById('profile-description').textContent = currentUser.description || 'Açıklama yok';
        if (currentUser.profileImage) {
            document.getElementById('profile-image').src = currentUser.profileImage;
        }
    }
}