document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("camarillaTableBody");

  // محاسبه تاریخ دیروز
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // تبدیل به فرمت YYYY-MM-DD
  const startDate = yesterday.toISOString().split("T")[0] + " 00:00:00";
  const endDate = yesterday.toISOString().split("T")[0] + " 23:59:00";

  try {
    // درخواست به API با تاریخ دیروز
    const response = await fetch(`https://api.twelvedata.com/time_series?apikey=8eca64515f2a4e58a6ee1152d5fc384b&interval=1day&timezone=utc&symbol=XAU/USD&start_date=${startDate}&end_date=${endDate}`);
    const data = await response.json();
    const candle = data.values[0]; // آخرین کندل روز

    const high = parseFloat(candle.high);
    const low = parseFloat(candle.low);
    const close = parseFloat(candle.close);
    const dateUTC = new Date(candle.datetime).toISOString().split("T")[0];

    const range = high - low;

    // محاسبه سطوح کاماریلا (R4 تا R1 و S1 تا S4)
    const R4 = (close + (range * 1.1 / 2)).toFixed(2);
    const R3 = (close + (range * 1.1 / 4)).toFixed(2);
    const R2 = (close + (range * 1.1 / 6)).toFixed(2);
    const R1 = (close + (range * 1.1 / 12)).toFixed(2);
    const S1 = (close - (range * 1.1 / 12)).toFixed(2);
    const S2 = (close - (range * 1.1 / 6)).toFixed(2);
    const S3 = (close - (range * 1.1 / 4)).toFixed(2);
    const S4 = (close - (range * 1.1 / 2)).toFixed(2);

    // نمایش در جدول
    tableBody.innerHTML = `
      <tr>
        <td>${dateUTC}</td> <!-- تاریخ امروز را نمایش می‌دهیم -->
        <td>${R4}</td>
        <td>${R3}</td>
        <td>${R2}</td>
        <td>${R1}</td>
        <td>${S1}</td>
        <td>${S2}</td>
        <td>${S3}</td>
        <td>${S4}</td>
      </tr>
    `;
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="9">خطا در دریافت اطلاعات</td></tr>`;
    console.error(error);
  }
});
