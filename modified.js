const apiKey = "8eca64515f2a4e58a6ee1152d5fc384b";
const symbol = "XAU/USD";

// تابع برای محاسبه تاریخ دیروز به فرمت UTC
function getYesterdayUTCDate() {
  const now = new Date();
  now.setDate(now.getDate() - 1); // یک روز از تاریخ امروز کم می‌کنیم
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split("T")[0];
}

// تابع برای محاسبه تاریخ امروز به فرمت UTC
function getTodayUTCDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split("T")[0];
}

const yesterday = getYesterdayUTCDate();
const today = getTodayUTCDate();

// دریافت داده‌ها از API برای روز گذشته
fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${apiKey}&start_date=${yesterday} 00:00:00&end_date=${yesterday} 23:59:00`)
  .then(res => res.json())
  .then(data => {
    const values = data.values[0];
    const high = parseFloat(values.high);
    const low = parseFloat(values.low);
    const close = parseFloat(values.close);
    const open = parseFloat(values.open);

    // محاسبه پیوت پوینت و سطوح مقاومتی و حمایتی
    const pivot = (high + low + close + open) / 4;
    const R1 = (2 * pivot) - low;
    const R2 = pivot + (high - low);
    const R3 = high + 2 * (pivot - low);
    const S1 = (2 * pivot) - high;
    const S2 = pivot - (high - low);
    const S3 = low - 2 * (high - pivot);

    // ساخت جدول نتایج
    const resultTable = `
      <table>
        <tr><th>Date (UTC)</th><th>Pivot</th><th>R1</th><th>R2</th><th>R3</th><th>S1</th><th>S2</th><th>S3</th></tr>
        <tr>
          <td>${today}</td> <!-- تاریخ امروز را نمایش می‌دهیم -->
          <td>${pivot.toFixed(2)}</td>
          <td>${R1.toFixed(2)}</td>
          <td>${R2.toFixed(2)}</td>
          <td>${R3.toFixed(2)}</td>
          <td>${S1.toFixed(2)}</td>
          <td>${S2.toFixed(2)}</td>
          <td>${S3.toFixed(2)}</td>
        </tr>
      </table>
    `;

    // نمایش جدول در صفحه
    document.getElementById("modified-results").innerHTML = resultTable;
  })
  .catch(err => console.error("API error:", err));
