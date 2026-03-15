// Authentication Functions

async function handleRegisteredLogin(event) {
    event.preventDefault();
    showLoading(true);
    
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const reason = document.getElementById('regReason').value;
    
    try {
        // Login user
        const loginResponse = await API.login({ username, password });
        
        if (loginResponse.data.success) {
            saveToken(loginResponse.data.token);
            saveCurrentUser(loginResponse.data.user);
            
            // Check in visitor
            const checkInResponse = await API.checkInVisitor({
                visitReason: reason
            });
            
            if (checkInResponse.data.success) {
                showToast(`✓ Welcome ${loginResponse.data.user.fullName}!`, 'success');
                document.getElementById('registeredLoginForm').reset();
                setTimeout(() => showPage('homePage'), 1500);
            }
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        showToast(message, 'error');
        console.error('Login error:', error);
    } finally {
        showLoading(false);
    }
}

async function handleCreateAccount(event) {
    event.preventDefault();
    showLoading(true);
    
    const username = document.getElementById('newUsername').value.trim();
    const fullName = document.getElementById('newFullName').value.trim();
    const age = document.getElementById('newAge').value;
    const gender = document.getElementById('newGender').value;
    const phone = document.getElementById('newPhone').value.trim();
    const address = document.getElementById('newAddress').value.trim();
    const sector = document.getElementById('newSector').value;
    const org = document.getElementById('newOrg').value.trim();
    const password = document.getElementById('newPassword').value;
    const password2 = document.getElementById('newPassword2').value;
    
    // Validation
    if (password !== password2) {
        showToast('Passwords do not match', 'error');
        showLoading(false);
        return;
    }
    
    if (!validatePhone(phone)) {
        showToast('Invalid phone number', 'error');
        showLoading(false);
        return;
    }
    
    try {
        const response = await API.register({
            username,
            email: username + '@library.local',
            password,
            fullName,
            age,
            gender,
            phone,
            address,
            sector,
            organization: org
        });
        
        if (response.data.success) {
            saveToken(response.data.token);
            saveCurrentUser(response.data.user);
            
            showIdCard(fullName, response.data.user.memberId, sector, org);
            document.getElementById('createAccountForm').reset();
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed';
        showToast(message, 'error');
    } finally {
        showLoading(false);
    }
}

async function handleLibrarianLogin(event) {
    event.preventDefault();
    showLoading(true);
    
    const username = document.getElementById('libUsername').value.trim();
    const password = document.getElementById('libPassword').value;
    
    try {
        const response = await API.login({ username, password });
        
        if (response.data.success) {
            const user = response.data.user;
            
            if (user.role !== 'admin' && user.role !== 'employee') {
                showToast('Only admin accounts can login here', 'error');
                showLoading(false);
                return;
            }
            
            saveToken(response.data.token);
            saveCurrentUser(user);
            
            showToast('Login successful', 'success');
            showPage('dashboardPage');
            document.getElementById('librarianLoginForm').reset();
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        showToast(message, 'error');
    } finally {
        showLoading(false);
    }
}

function logout() {
    removeToken();
    showToast('Logged out successfully', 'success');
    showPage('homePage');
}

// ID Card Display
function showIdCard(name, id, sector, org) {
    document.getElementById('cardName').textContent = name;
    document.getElementById('cardId').textContent = id;
    document.getElementById('cardSector').textContent = sector;
    document.getElementById('cardOrg').textContent = org;
    document.getElementById('cardDate').textContent = new Date().toLocaleDateString();
    document.getElementById('barcodeText').textContent = id;
    
    try {
        JsBarcode("#barcode", id, {
            format: "CODE128",
            width: 2,
            height: 50,
            displayValue: false
        });
    } catch(err) {
        console.log('Barcode library loading...');
    }
    
    showModal('idCardModal');
}

function closeModal() {
    document.getElementById('idCardModal').classList.remove('show');
}

function printIdCard() {
    window.print();
}

function downloadIdCard() {
    const card = document.getElementById('idCard');
    const opt = {
        margin: 10,
        filename: 'library-id-card.pdf',
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    // Note: Requires html2pdf library
    if (window.html2pdf) {
        window.html2pdf().set(opt).from(card).save();
    } else {
        showToast('PDF download not available', 'info');
    }
}

function completeRegistration() {
    closeModal();
    showPage('homePage');
}