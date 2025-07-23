import Swal from 'sweetalert2';

// Custom SweetAlert configurations with modern animations
export const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    timer: 1000,
    timerProgressBar: true,
    showConfirmButton: false,
    title,
    text,
    icon: 'success',
    allowOutsideClick: true,
    allowEscapeKey: true,
    toast: true,
    position: 'top-end',
    showClass: {
      popup: 'animate__animated animate__fadeInDown animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    },
    customClass: {
      popup: 'colored-toast'
    },
    background: '#f0f9ff',
    color: '#1e40af',
    iconColor: '#10b981'
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    toast: true,
    position: 'top-end',
    showClass: {
      popup: 'animate__animated animate__shakeX animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    },
    customClass: {
      popup: 'colored-toast'
    },
    background: '#fef2f2',
    color: '#dc2626',
    iconColor: '#ef4444'
  });
};

export const showWarningAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    timer: 2500,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: true,
    allowEscapeKey: true,
    toast: true,
    position: 'top-end',
    showClass: {
      popup: 'animate__animated animate__bounceIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    },
    customClass: {
      popup: 'colored-toast'
    },
    background: '#fffbeb',
    color: '#d97706',
    iconColor: '#f59e0b'
  });
};

export const showInfoAlert = (title: string, text?: string) => {
  return Swal.fire({
    timer: 1000,
    timerProgressBar: true,
    showConfirmButton: false,
    title,
    text,
    icon: 'info',
    allowOutsideClick: true,
    allowEscapeKey: true,
    toast: true,
    position: 'top-end',
    showClass: {
      popup: 'animate__animated animate__slideInRight animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__slideOutRight animate__faster'
    },
    customClass: {
      popup: 'colored-toast'
    },
    background: '#f0f9ff',
    color: '#2563eb',
    iconColor: '#3b82f6'
  });
};

export const showConfirmDialog = (title: string, text: string, confirmText = 'Ya, Hapus!', cancelText = 'Batal') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    showClass: {
      popup: 'animate__animated animate__zoomIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__zoomOut animate__faster'
    },
    customClass: {
      confirmButton: 'swal2-confirm-modern',
      cancelButton: 'swal2-cancel-modern',
      popup: 'swal2-popup-modern'
    },
    buttonsStyling: false,
    background: '#ffffff',
    color: '#374151',
    iconColor: '#f59e0b'
  });
};

export const showLoadingAlert = (title: string, text?: string) => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    customClass: {
      popup: 'swal2-loading-modern'
    },
    didOpen: () => {
      Swal.showLoading();
    },
    background: '#ffffff',
    color: '#374151'
  });
};

export const showLoginSuccessAlert = (userName: string) => {
  return Swal.fire({
    timer: 1000,
    timerProgressBar: true,
    showConfirmButton: false,
    title: '🎉 Selamat Datang!',
    html: `
      <div class="login-success-content">
        <div class="user-avatar">
          <div class="avatar-circle">
            <i class="fas fa-user-shield"></i>
          </div>
        </div>
        <p class="welcome-text">Halo, <strong>${userName}</strong></p>
        <p class="role-text">Anda berhasil masuk sebagai Administrator</p>
      </div>
    `,
    icon: 'success',
    allowOutsideClick: true,
    allowEscapeKey: true,
    showClass: {
      popup: 'animate__animated animate__bounceIn animate__slow'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    },
    customClass: {
      popup: 'swal2-login-success'
    },
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    iconColor: '#10b981'
  });
};

export const showCRUDSuccessAlert = (action: 'create' | 'update' | 'delete', itemName: string) => {
  const actions = {
    create: { title: '✅ Berhasil Ditambahkan!', text: `${itemName} telah berhasil ditambahkan ke sistem`, icon: 'success' as const },
    update: { title: '📝 Berhasil Diperbarui!', text: `${itemName} telah berhasil diperbarui`, icon: 'success' as const },
    delete: { title: '🗑️ Berhasil Dihapus!', text: `${itemName} telah berhasil dihapus dari sistem`, icon: 'success' as const }
  };

  const config = actions[action];

  return Swal.fire({
    timer: 1000,
    timerProgressBar: true,
    showConfirmButton: false,
    title: config.title,
    text: config.text,
    icon: config.icon,
    allowOutsideClick: true,
    allowEscapeKey: true,
    toast: true,
    position: 'top-end',
    showClass: {
      popup: 'animate__animated animate__slideInRight animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__slideOutRight animate__faster'
    },
    customClass: {
      popup: 'swal2-crud-success'
    },
    background: '#f0fdf4',
    color: '#166534',
    iconColor: '#22c55e'
  });
};