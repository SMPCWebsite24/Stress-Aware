// Data Pertanyaan (15 Pertanyaan)
const questions = [
    "Selama sebulan terakhir,seberapa sering anda tidak nyaman karena sesuatu yang tidak terduga?",
    "Selama sebulan terakhir,seberapa sering anda merasa tidak mampu mengontrol hal-hal penting dalam kehidupan anda?",
    "Selama sebulan terakhir,seberapa sering anda merasa ketegangan dan stress?",
    "Selama sebulan terakhir,seberapa sering anda merasa percaya diri pada kemampuan anda untuk menangani masalah pribadi?",
    "Selama sebulan terakhir,seberapa sering anda merasa sagala sesuatu yang terjadi sesuai dengan harapan anda",
    "Selama sebulan terakhir,seberapa sering anda merasa tidak mampu menyelesaikan hal-hal yang harus dikerjakan?",
    "Selama sebulan terakhir,seberapa sering anda bisa mengendalikan gangguan dalam hidup anda?",
    "Selama sebulan terakhir,seberapa sering anda merasa bahwa anda memiliki kendali (mengendalikan semua urusan)?",
    "Selama sebulan terakhir,seberapa sering anda telah marah karena hal-hal diluar kendali anda?",
    "Selama sebulan terakhir,seberapa sering anda merasa kesulitan menumpuk begitu banyak dan anda tidak bisa mengatasinya?"
];

// Opsi Skala Jawaban
const scaleOptions = [
    { text: "Tidak Pernah", value: 0 },
    { text: "Jarang", value: 1 },
    { text: "Kadang-kadang", value: 2 },
    { text: "Sering", value: 3 },
    { text: "Hampir Selalu", value: 4 }
];

// Variabel Global
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null);
let studentData = { name: "", jenjang: "", kelas: "" };

// Fungsi Navigasi Halaman
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Fungsi Update Pilihan Kelas berdasarkan Jenjang
function updateKelasOptions() {
    const jenjang = document.getElementById("jenjang").value;
    const kelasSelect = document.getElementById("kelas");
    kelasSelect.innerHTML = '<option value="">-- Pilih Kelas --</option>'; // Reset

    if (jenjang === "SMP") {
        ['VII (7)', 'VIII (8)', 'IX (9)'].forEach(k => {
            kelasSelect.innerHTML += `<option value="${k}">${k}</option>`;
        });
    } else if (jenjang === "SMA") {
        ['X (10)', 'XI (11)', 'XII (12)'].forEach(k => {
            kelasSelect.innerHTML += `<option value="${k}">${k}</option>`;
        });
    }
}

// Memulai Tes & Validasi Form
function startTest() {
    const jenjang = document.getElementById("jenjang").value;
    const kelas = document.getElementById("kelas").value;
    let name = document.getElementById("nama").value;
    
    if (!jenjang || !kelas) {
        alert("Silakan pilih Jenjang dan Kelas terlebih dahulu.");
        return;
    }
    
    studentData.name = name || "Siswa";
    studentData.jenjang = jenjang;
    studentData.kelas = kelas;
    
    currentQuestionIndex = 0;
    userAnswers.fill(null);
    renderQuestion();
    showPage('quiz-page');
}

// Menampilkan Pertanyaan dan Opsi
function renderQuestion() {
    // Update Teks Pertanyaan
    document.getElementById("question-text").innerText = questions[currentQuestionIndex];
    
    // Update Progress
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = `${progressPercent}%`;
    document.getElementById("progress-text").innerText = `Pertanyaan ${currentQuestionIndex + 1} dari ${questions.length}`;

    // Render Opsi Jawaban
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    
    scaleOptions.forEach((option) => {
        const isSelected = userAnswers[currentQuestionIndex] === option.value;
        const div = document.createElement("label");
        div.className = `option-label ${isSelected ? 'selected' : ''}`;
        
        div.innerHTML = `
            <input type="radio" name="answer" value="${option.value}" ${isSelected ? 'checked' : ''} onclick="selectOption(${option.value}, this)">
            ${option.text}
        `;
        optionsContainer.appendChild(div);
    });

    // Mengatur Tombol Navigasi
    document.getElementById("btn-prev").style.visibility = currentQuestionIndex === 0 ? "hidden" : "visible";
    
    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById("btn-next").style.display = "none";
        document.getElementById("btn-result").style.display = "inline-block";
    } else {
        document.getElementById("btn-next").style.display = "inline-block";
        document.getElementById("btn-result").style.display = "none";
    }
}

// Menyimpan Jawaban Sementara
function selectOption(value, element) {
    userAnswers[currentQuestionIndex] = value;
    
    // Hapus kelas 'selected' dari semua opsi
    document.querySelectorAll('.option-label').forEach(lbl => lbl.classList.remove('selected'));
    // Tambah kelas 'selected' ke yang dipilih (parent dari input)
    element.parentElement.classList.add('selected');
}

// Tombol Selanjutnya
function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === null) {
        alert("Silakan pilih salah satu jawaban sebelum melanjutkan.");
        return;
    }
    currentQuestionIndex++;
    renderQuestion();
}

// Tombol Sebelumnya
function prevQuestion() {
    currentQuestionIndex--;
    renderQuestion();
}

// Menghitung dan Menampilkan Hasil Akhir
function showResult() {
    if (userAnswers[currentQuestionIndex] === null) {
        alert("Silakan pilih jawaban terakhir sebelum melihat hasil.");
        return;
    }

    // Hitung Total Skor
    const totalScore = userAnswers.reduce((a, b) => a + b, 0);
    
    // Siapkan Data DOM
    document.getElementById("result-name").innerText = studentData.name;
    document.getElementById("result-class").innerText = `${studentData.jenjang} - Kelas ${studentData.kelas}`;
    
    const scoreCircle = document.getElementById("score-number");
    const circleContainer = document.querySelector(".score-circle");
    const stressLevelText = document.getElementById("stress-level");
    const explanationText = document.getElementById("stress-explanation");
    const adviceList = document.getElementById("advice-list");
    
    // Animasi Angka Skor (Hitung Cepat)
    let tempScore = 0;
    const interval = setInterval(() => {
        if (tempScore >= totalScore) {
            clearInterval(interval);
            scoreCircle.innerText = totalScore;
        } else {
            tempScore++;
            scoreCircle.innerText = tempScore;
        }
    }, 20);

    // Tentukan Kategori, Warna, Penjelasan, dan Saran
    let kategori = "";
    let color = "";
    let penjelasan = "";
    let saran = [];

    if (totalScore <= 15) {
        kategori = "TINGKAT STRES RENDAH";
        color = "#4ade80"; // Hijau Lembut
        penjelasan = "Kondisi stres yang kamu rasakan saat ini relatif rendah. Ini hal yang sangat baik! Tetap jaga keseimbangan antara belajar, beristirahat, bermain, dan melakukan kegiatan yang kamu sukai.";
        saran = [
            "Pertahankan pola belajar yang seimbang.",
            "Luangkan waktu untuk melakukan aktivitas yang menyenangkan.",
            "Tetap tidur dan beristirahat dengan cukup.",
            "Ceritakan perasaan positifmu kepada teman atau keluarga.",
            "Jangan terlalu memaksakan diri jika merasa lelah."
        ];
    } else if (totalScore <= 30) {
        kategori = "TINGKAT STRES SEDANG";
        color = "#fbbf24"; // Kuning Hangat
        penjelasan = "Kamu mungkin sedang menghadapi beberapa hal yang cukup membebani pikiran. Ini sangat wajar dialami oleh siswa. Cobalah mengatur waktu, beristirahat dengan cukup, dan jangan ragu bercerita.";
        saran = [
            "Buat daftar prioritas tugas agar tidak menumpuk.",
            "Pecah tugas besar menjadi beberapa bagian kecil yang mudah dikerjakan.",
            "Ambil waktu istirahat (break) di sela jam belajar.",
            "Lakukan aktivitas fisik ringan atau olahraga santai.",
            "Kurangi penggunaan gadget ketika sedang belajar agar lebih fokus.",
            "Ceritakan masalah atau keluh kesahmu kepada teman, guru, atau orang tua.",
            "Gunakan teknik pernapasan sederhana (tarik napas dalam) untuk menenangkan diri."
        ];
    } else if (totalScore <= 45) {
        kategori = "TINGKAT STRES TINGGI";
        color = "#f97316"; // Oranye
        penjelasan = "Jawabanmu menunjukkan bahwa kamu mungkin sedang mengalami tekanan yang cukup berat. Jangan menghadapi semuanya sendirian. Ada banyak orang yang peduli dan siap mendengarkanmu.";
        saran = [
            "Berhenti sejenak dan berikan waktu istirahat penuh untuk dirimu sendiri.",
            "Kurangi beban aktivitas ekstrakurikuler atau hal yang tidak terlalu penting saat ini.",
            "Atur ulang jadwal belajar agar kamu mendapat tidur yang cukup.",
            "Jangan menyimpan masalah sendirian di dalam hati.",
            "Bicaralah dengan orang tua/wali, guru, wali kelas, atau konselor sekolah (Guru BK).",
            "Jika perasaan tertekan terus berlangsung, mintalah bantuan dari orang dewasa yang dapat dipercaya."
        ];
    } else {
        kategori = "TINGKAT STRES SANGAT TINGGI";
        color = "#ef4444"; // Merah (digunakan terbatas hanya di indikator agar tidak menakutkan)
        penjelasan = "Jawabanmu menunjukkan bahwa kamu mungkin sedang merasa sangat terbebani. Kamu tidak harus menghadapi semuanya sendirian. Sangat disarankan untuk segera mencari teman cerita.";
        saran = [
            "Kamu tidak harus menghadapi semuanya sendirian.",
            "Segera berbicara dengan orang tua/wali di rumah.",
            "Bicaralah dengan Wali Kelas atau Guru BK/Konselor Sekolah secara terbuka.",
            "Fokuslah pada kesehatan fisik dan mentalmu terlebih dahulu di atas nilai akademis.",
            "Temui orang dewasa yang kamu percaya untuk membantumu mengurai beban pikiran."
        ];
    }

    // Terapkan ke DOM
    stressLevelText.innerText = kategori;
    stressLevelText.style.color = color;
    circleContainer.style.backgroundColor = color;
    explanationText.innerText = penjelasan;
    
    adviceList.innerHTML = "";
    saran.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        adviceList.appendChild(li);
    });

    showPage('result-page');
}

// Fungsi Navigasi Tips
function showTips() {
    showPage('tips-page');
}

// Fungsi Ulangi Tes
function resetTest() {
    if(confirm("Apakah kamu yakin ingin mengulangi tes dari awal?")) {
        // Reset form input (opsional, jika ingin dikosongkan)
        // document.getElementById("nama").value = ""; 
        showPage('home-page');
    }
}

// Fitur Interaksi Emoji Harian (Visual Saja)
function selectEmoji(element) {
    document.querySelectorAll('.emoji-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}