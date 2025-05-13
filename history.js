// خواندن و نمایش تاریخچه ذخیره‌شده از localStorage
const history = JSON.parse(localStorage.getItem('pivotHistory')) || [];
const div = document.getElementById('history');
if (history.length === 0) {
  div.innerHTML = "<p>هیچ داده‌ای یافت نشد.</p>";
} else {
  let html = "<table><tr><th>تاریخ</th><th>R1</th><th>R2</th><th>R3</th><th>S1</th><th>S2</th><th>S3</th></tr>";
  history.forEach(entry => {
    html += `<tr><td>${entry.date}</td><td>${entry.R1}</td><td>${entry.R2}</td><td>${entry.R3}</td>
             <td>${entry.S1}</td><td>${entry.S2}</td><td>${entry.S3}</td></tr>`;
  });
  html += "</table>";
  div.innerHTML = html;
}
