const apiKey = "8eca64515f2a4e58a6ee1152d5fc384b";
const symbol = "XAU/USD";

// تابع برای محاسبه تاریخ امروز به فرمت UTC
function getTodayUTCDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split("T")[0];
}

const today = getTodayUTCDate();

// چک کردن تاریخ آخرین بروزرسانی ذخیره‌شده در localStorage
const lastUpdatedDate = localStorage.getItem("lastUpdatedDatePivot");

// اگر تاریخ امروز همان تاریخ ذخیره‌شده در localStorage باشد، از داده‌های قبلی استفاده می‌کنیم
if (lastUpdatedDate === today) {
  const savedPivotData = JSON.parse(localStorage.getItem("pivotData"));
  if (savedPivotData) {
    // نمایش داده‌های ذخیره‌شده
    const resultTable = `
      <table>
        <tr><th>Date (UTC)</th><th>Pivot</th><th>R1</th><th>R2</th><th>R3</th><th>S1</th><th>S2</th><th>S3</th></tr>
        <tr>
          <td>${savedPivotData.date}</td>
          <td>${savedPivotData.pivot}</td>
          <td>${savedPivotData.R1}</td>
          <td>${savedPivotData.R2}</td>
          <td>${savedPivotData.R3}</td>
          <td>${savedPivotData.S1}</td>
          <td>${savedPivotData.S2}</td>
          <td>${savedPivotData.S3}</td>
        </tr>
      </table>
    `;
    document.getElementById("modified-results").innerHTML = resultTable;
    console.log("داده‌ها از localStorage خوانده شدند.");
  }
} else {
  // دریافت داده‌های امروز از API
  fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${apiKey}&outputsize=1`)
    .then(res => res.json())
    .then(data => {
      const values = data.values[0];
      const high = parseFloat(values.high);
      const low = parseFloat(values.low);
      const close = parseFloat(values.close);
      const open = parseFloat(values.open);

      // محاسبه پیوت پوینت اصلی (بدون استفاده از Open)
      const pivot = (high + low + close) / 3;
      const R1 = (2 * pivot) - low;
      const R2 = pivot + (high - low);
      const R3 = high + 2 * (pivot - low);
      const S1 = (2 * pivot) - high;
      const S2 = pivot - (high - low);
      const S3 = low - 2 * (high - pivot);

      // ساخت جدول برای نمایش
      const resultTable = `
        <table>
          <tr><th>Date (UTC)</th><th>Pivot</th><th>R1</th><th>R2</th><th>R3</th><th>S1</th><th>S2</th><th>S3</th></tr>
          <tr>
            <td>${today}</td>
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
      document.getElementById("modified-results").innerHTML = resultTable;

      // ذخیره داده‌ها در localStorage برای استفاده در روزهای بعدی
      const pivotData = {
        date: today,
        pivot: pivot.toFixed(2),
        R1: R1.toFixed(2),
        R2: R2.toFixed(2),
        R3: R3.toFixed(2),
        S1: S1.toFixed(2),
        S2: S2.toFixed(2),
        S3: S3.toFixed(2),
      };
      localStorage.setItem("pivotData", JSON.stringify(pivotData));
      localStorage.setItem("lastUpdatedDatePivot", today);

    })
    .catch(err => {
      console.error("API error:", err);
      document.getElementById("modified-results").innerHTML = `<tr><td colspan="8">خطا در دریافت داده‌ها</td></tr>`;
    });
}
