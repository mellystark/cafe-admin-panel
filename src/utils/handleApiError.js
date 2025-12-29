// src/utils/handleApiError.js

export function handleApiError(error) {
  if (!error.response) {
    // Network / server down
    alert("Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.");
    return;
  }

  const status = error.response.status;

  if (status === 400) {
    alert("Gönderilen veriler hatalı.");
  }

  if (status === 401) {
    alert("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
  }

  if (status === 403) {
    alert("Bu işlem için yetkiniz yok.");
  }

  if (status >= 500) {
    alert("Sunucu hatası oluştu.");
  }
}
