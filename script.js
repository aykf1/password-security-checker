const passwordInput = document.querySelector('#password');
const visibilityButton = document.querySelector('#toggle-visibility');
const strengthLabel = document.querySelector('#strength-label');
const strengthProgress = document.querySelector('#strength-progress');
const feedback = document.querySelector('#feedback');

const checks = {
  length: (value) => value.length >= 12,
  lower: (value) => /[a-z]/.test(value),
  upper: (value) => /[A-Z]/.test(value),
  number: (value) => /\d/.test(value),
  symbol: (value) => /[^A-Za-z0-9]/.test(value),
};

const commonPatterns = [
  /^password/i,
  /^qwerty/i,
  /^123456/,
  /^abc123/i,
  /^letmein/i,
];

function updateChecker() {
  const value = passwordInput.value;

  if (!value) {
    Object.keys(checks).forEach((name) => {
      document.querySelector(`[data-check="${name}"]`).classList.remove('passed');
    });
    strengthProgress.dataset.score = '0';
    strengthProgress.setAttribute('aria-valuenow', '0');
    strengthLabel.textContent = 'Henüz değerlendirilmedi';
    feedback.textContent = 'Şifreni yazdığında sana özel öneriler burada görünecek.';
    return;
  }

  let score = 0;
  Object.entries(checks).forEach(([name, check]) => {
    const passed = check(value);
    const row = document.querySelector(`[data-check="${name}"]`);
    row.classList.toggle('passed', passed);
    row.querySelector('.check-icon').textContent = passed ? '✓' : '○';
    if (passed) score += 1;
  });

  const hasCommonPattern = commonPatterns.some((pattern) => pattern.test(value));
  const adjustedScore = hasCommonPattern ? Math.min(score, 2) : score;
  const labels = ['Çok zayıf', 'Zayıf', 'Geliştirilmeli', 'Orta', 'Güçlü', 'Çok güçlü'];
  strengthProgress.dataset.score = String(adjustedScore);
  strengthProgress.setAttribute('aria-valuenow', String(adjustedScore));
  strengthLabel.textContent = hasCommonPattern ? 'Yaygın bir kalıp içeriyor' : labels[adjustedScore];

  if (hasCommonPattern) {
    feedback.textContent = 'Bu şifre yaygın kullanılan bir kelime veya kalıpla başlıyor. Tahmin edilmesi daha zor, benzersiz bir parola seç.';
  } else if (score < 3) {
    feedback.textContent = 'Uzunluğu artırıp farklı karakter türleri eklemeyi dene. En az 12 karakter kullanmak iyi bir başlangıçtır.';
  } else if (score < 5) {
    feedback.textContent = 'İyi gidiyor. Eksik ölçütleri de ekleyerek şifreni daha güçlü hâle getirebilirsin.';
  } else {
    feedback.textContent = 'Güzel! Bu temel ölçütlerin hepsini karşılıyor. Her hesapta farklı ve benzersiz bir şifre kullan.';
  }
}

passwordInput.addEventListener('input', updateChecker);

visibilityButton.addEventListener('click', () => {
  const willShow = passwordInput.type === 'password';
  passwordInput.type = willShow ? 'text' : 'password';
  visibilityButton.setAttribute('aria-pressed', String(willShow));
  visibilityButton.setAttribute('aria-label', willShow ? 'Şifreyi gizle' : 'Şifreyi göster');
});
