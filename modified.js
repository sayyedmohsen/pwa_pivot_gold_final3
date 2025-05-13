const apiKey = "8eca64515f2a4e58a6ee1152d5fc384b";
const symbol = "XAU/USD";

// تابع برای محاسبه تاریخ امروز به فرمت UTC
function getTodayUTCDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().split("T")[0];
}

// تابع برای محاسبه تاریخ روز گذشته به فرمت UTC
function getYesterdayUTCDate() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1); // تاریخ روز گذشته
  return new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate())).toISOString().split("T")[0];
}

const today = getTodayUTCDate();
const yesterday = getYesterdayUTCDate();

// درخواست به API برای دریافت داده‌های کندل روزانه روز گذشته
fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${apiKey}&timezone=UTC&start_date=${yesterday} 00:00:00&end_date=${yesterday} 23:59:59`)
  .then(res => res.json())
  .then(data => {
    if (data.values && data.values.length > 0) {
      const candle = data.values[0]; // داده‌های روز گذشته
      const open = parseFloat(candle.open);  // قیمت باز شدن روز گذشته
      const high = parseFloat(candle.high);  // بالاترین قیمت روز گذشته
      const low = parseFloat(candle.low);    // پایین‌ترین قیمت روز گذشته
      const close = parseFloat(candle.close); // قیمت بسته شدن روز گذشته

      // محاسبه پیوت پوینت و سطوح
      const pivot = (high + low + close) / 3;
      const R1 = (2 * pivot) - low;
      const R2 = pivot + (high - low);
      const R3 = high + 2 * (pivot - low);
      const S1 = (2 * pivot) - high;
      const S2 = pivot - (high - low);
      const S3 = low - 2 * (high - pivot);

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

      // ذخیره داده‌ها در localStorage برای جلوگیری از بروزرسانی غیرضروری
      const pivotData = {
        date: today,
        pivot: pivot.toFixed(2),
        R1: R1.toFixed(2),
        R2: R2.toFixed(2),
        R3: R3.toFixed(2),
        S1: S1.toFixed(2),
        S2: S2.toFixed(2),
        S3: S3.toFixed(2)
      };

      // ذخیره تاریخ و پیوت‌ها در localStorage
      const lastUpdatedDate = localStorage.getItem("lastUpdatedDatePivot");
      if (lastUpdatedDate !== today) {
        localStorage.setItem("pivotData", JSON.stringify(pivotData));
        localStorage.setItem("lastUpdatedDatePivot", today); // ذخیره تاریخ امروز
      }
    } else {
      console.error("داده‌ها موجود نیست.");
    }
  })
  .catch(err => console.error("خطا در دریافت داده‌ها از API:", err));
