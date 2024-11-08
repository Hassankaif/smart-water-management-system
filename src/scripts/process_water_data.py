import pandas as pd
import plotly.graph_objects as go
import json
import os

# Read the CSV file
df = pd.read_csv('water_consumption_data.csv')

# Group by date and sum the water usage for the entire building
daily_consumption = df.groupby('date')['water_usage'].sum().reset_index()

# Create the line plot
fig = go.Figure()
fig.add_trace(
    go.Scatter(
        x=daily_consumption['date'],
        y=daily_consumption['water_usage'],
        mode='lines',
        name='Building Water Consumption',
        line=dict(color='#2196f3', width=2)
    )
)

# Update layout
fig.update_layout(
    title='Building Daily Water Consumption',
    xaxis_title='Date',
    yaxis_title='Water Usage (Liters)',
    template='plotly_white',
    hovermode='x unified',
    height=400,
    margin=dict(l=50, r=50, t=50, b=50)
)

# Save the plot data as JSON
plot_data = {
    'dates': daily_consumption['date'].tolist(),
    'consumption': daily_consumption['water_usage'].tolist()
}

# Create the directory if it doesn't exist
os.makedirs('src/data', exist_ok=True)

# Save the plot data as JSON
with open('src/data/water_consumption.json', 'w') as f:
    json.dump(plot_data, f) 