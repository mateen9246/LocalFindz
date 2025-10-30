function openingClosingFinder(store, findDay = false) {
  const days = Object.keys(store?.businessHours);
  for (const day of days) {
    if (store?.businessHours[day]?.isOpen) {
      if (findDay) {
        return day;
      }
      return {
        openingTime: store?.businessHours[day]?.opening,
        closingTime: store?.businessHours[day]?.closing,
      };
    }
  }
  return {
    openingTime: 'N/A',
    closingTime: 'N/A',
  };
}

function formatToAmPm(time24) {
  const [hours, minutes] = time24.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// --- helpers ---
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function parseViewDate(doc) {
  if (doc?.timestamp?.seconds != null) {
    const ms =
      doc.timestamp.seconds * 1000 +
      Math.floor((doc.timestamp.nanoseconds || 0) / 1e6);
    return new Date(ms); // Firestore Timestamp -> JS Date (UTC)
  }
  if (doc?.date) return new Date(doc.date); // ISO string
  return null;
}

/**
 * Build chart-kit data for a given year (default: current year).
 * views: array of your docs (as shown in your example)
 */
export function buildMonthlyViewsChartData(
  views = [],
  year = new Date().getFullYear(),
) {
  const counts = Array(12).fill(0);

  for (const v of views) {
    const d = parseViewDate(v);
    if (!d) continue;
    if (d.getFullYear() !== year) continue; // keep only this year's views
    const m = d.getMonth(); // 0..11
    counts[m] += 1;
  }

  return {
    labels: MONTH_LABELS,
    datasets: [
      {
        data: counts,
        // chart-kit expects a function; use rgba (not rgb) when including alpha
        color: (opacity = 1) => `rgba(153, 0, 204, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
}

export default {
  openingClosingFinder,
  formatToAmPm,
  buildMonthlyViewsChartData,
};
