import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Initialize Supabase client with your credentials
const supabaseUrl = 'https://oxebojkujqmdudvluhmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94ZWJvamt1anFtZHVkdmx1aG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2NTYxMjEsImV4cCI6MjAzNDIzMjEyMX0.1jv8JvwELio-41aS68XejkUKPQi_GFa8ojIkfPpEIqU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateGauges() {
    try {
        const { data, error } = await supabase
            .from('air_quality_metrics')
            .select()
            .order('timestamp', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching data:', error.message);
            return;
        }

        const latestData = data[0];

        updateGauge('temperatureGauge', latestData.temperature);
        updateGauge('humidityGauge', latestData.humidity);
        updateGauge('TVOCGauge', latestData.TVOC);
        updateGauge('CH2OGauge', latestData.CH2O);
        updateGauge('CO2Gauge', latestData.CO2);
        updateGauge('PM25Gauge', latestData.PM25);
        updateGauge('PM10Gauge', latestData.PM10);
    } catch (error) {
        console.error('Error updating gauges:', error.message);
    }
}

function updateGauge(gaugeId, value) {
    const gauge = document.getElementById(gaugeId);
    if (!gauge) return;

    const canvas = gauge.querySelector('canvas');
    if (!canvas) return;

    const options = {
        min: 0,
        max: 100, // Adjust max value as per your data range
        value: value,
        gaugeWidthScale: 0.6,
        counter: true,
        hideMinMax: false,
        humanFriendly: true,
        startAnimationTime: 500,
        refreshAnimationTime: 500,
        title: gauge.querySelector('.gauge-label').innerText
    };

    const g = new JustGage({
        id: gaugeId,
        ...options
    });

    g.refresh(value); // Update gauge value
}

// Initial update when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateGauges();
    // Update gauges every 10 seconds (adjust as needed)
    setInterval(updateGauges, 10000);
});
