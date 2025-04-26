
document.addEventListener('gesturestart', e => e.preventDefault());

let baselineE1RM = null;

document.querySelectorAll(".finish-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const row = btn.closest(".set-row");
    const weight = row.querySelector(".weight");
    const reps = row.querySelector(".reps");
    const rpe = row.querySelector(".rpe");
    const rest = row.querySelector(".rest");
    const setNum = parseInt(row.getAttribute("data-set"));

    if (!btn.classList.contains("active")) {
      btn.classList.add("active");
      btn.textContent = "Done";
      weight.readOnly = reps.readOnly = true;
      rpe.disabled = true;

      // Timer
      let s = 90;
      const interval = setInterval(() => {
        if (s > 0) {
          rest.textContent = "Rest: " + s + "s";
          s--;
        } else {
          rest.textContent = "Rest: FIGHT!";
          clearInterval(interval);
        }
      }, 1000);

      // Autoreg
      const w = parseFloat(weight.value);
      const r = parseInt(reps.value);
      const rp = parseInt(rpe.value);
      if (!isNaN(w) && !isNaN(r) && !isNaN(rp)) {
        const e1rm = Math.round(w * (1 + r * 0.0333));
        if (setNum === 1) {
          baselineE1RM = e1rm;
        } else if (baselineE1RM && setNum === 2) {
          const fatigue = 1 - (e1rm / baselineE1RM);
          const nextRow = document.querySelector(`.set-row[data-set='${setNum + 1}']`);
          if (nextRow) {
            const nextWeight = nextRow.querySelector(".weight");
            if (!nextWeight.readOnly) {
              let adjusted = w;
              if (fatigue > 0.05) adjusted -= 2.5;
              else if (fatigue < -0.03) adjusted += 2.5;
              nextWeight.value = Math.round(adjusted * 2) / 2;
              nextWeight.classList.add("autoregulated");
            }
          }
        }
      }
    } else {
      btn.classList.remove("active");
      btn.textContent = "Finish";
      weight.readOnly = reps.readOnly = false;
      rpe.disabled = false;
    }
  });
});
