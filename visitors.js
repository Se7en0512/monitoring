// Visitor Functions

async function handleGuestCheckIn(event) {
    event.preventDefault();
    showLoading(true);
    
    const formData = {
        name: document.getElementById('guestName').value.trim(),
        age: document.getElementById('guestAge').value,
        gender: document.getElementById('guestGender').value,
        phone: document.getElementById('guestPhone').value.trim(),
        address: document.getElementById('guestAddress').value.trim(),
        sector: document.getElementById('guestSector').value,
        organization: document.getElementById('guestOrg').value.trim(),
        visitReason: document.getElementById('guestReason').value
    };
    
    try {
        const response = await API.checkInGuest(formData);
        
        if (response.data.success) {
            showToast(`✓ Welcome ${formData.name}!`, 'success');
            document.getElementById('guestForm').reset();
            setTimeout(() => showPage('homePage'), 1500);
        }
    } catch (error) {
        const message = error.response?.data?.message || 'Check-in failed';