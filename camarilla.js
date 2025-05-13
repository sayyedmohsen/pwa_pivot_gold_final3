document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("camarillaTableBody");

  // محاسبه تاریخ دیروز
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const startDate = yesterday.toISOString().split("T")[0] + " 00:00:00";
  const endDate = yesterday.toISOString().split("T")[0] + " 23:59:00";

  // چک کردن تاریخ آخرین بروزرسانی ذخیره شده در localStorage
  const lastUpdatedDate = localStorage.getItem("lastUpdatedDateCamarilla");

  // اگر تاریخ امروز همان تاریخ ذخیره‌شده در localStorage باشد، از داده‌های قبلی استفاده می‌کنیم
  if (lastUpdatedDate === yesterday.toISOString().split("T")[0]) {
    const savedCamarillaData = JSON.parse(localStorage.getItem("camarillaData"));
    if (savedCamarillaData) {
      // نمایش داده‌های ذخیره‌شده
      tableBody.innerHTML = `
        <tr>
          <td>${savedCamarillaData.date}</td>
          <td>${savedCamarillaData.R4}</td>
          <td>${savedCamarillaData.R3}</td>
          <td>${savedCamarillaData.R2}</td>
          <td>${savedCamarillaData.R1}</td>
          <td>${savedCamarillaData.S1}</td>
          <td>${savedCamarillaData.S2}</td>
          <td>${savedCamarillaData.S3}</td>
          <td>${savedCamarillaData.S4}</td>
        </tr>
      `;
      console.log("داده‌ها از localStorage خوانده شدند.");
    }
  } else {
    try {
      // درخواست به API برای دریافت داده‌های دیروز
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

      tableBody.innerHTML = `
        <tr>
          <td>${dateUTC}</td>
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

      // ذخیره داده‌ها در localStorage برای استفاده در روزهای بعدی
      const camarillaData = {
        date: dateUTC,
        R4: R4,
        R3: R3,
        R2: R2,
        R1: R1,
        S1: S1,
        S2: S2,
        S3: S3,
        S4: S4,
      };
      localStorage.setItem("camarillaData", JSON.stringify(camarillaData));
      localStorage.setItem("lastUpdatedDateCamarilla", yesterday.toISOString().split("T")[0]);

    } catch (error) {
      tableBody.innerHTML = `<tr><td colspan="9">خطا در دریافت اطلاعات</td></tr>`;
      console.error(error);
    }
  }
});
