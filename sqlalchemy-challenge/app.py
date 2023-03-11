import numpy as np
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
# Create engine to hawaii.sqlite
engine = create_engine('sqlite:///Resources/hawaii.sqlite')

# Reflect an existing database into a new model
Base = automap_base()

# Reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
measurement = Base.classes.measurement
station = Base.classes.station

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route('/')
def welcome():
    '''List all available api routes.'''
    return (
        f'Available Routes:<br/>'
        f'/api/v1.0/precipitation<br/>'
        f'/api/v1.0/stations<br/>'
        f'/api/v1.0/tobs<br/>'
        f'/api/v1.0/2010-01-01<br/>'
        f'/api/v1.0/2010-01-01/2017-08-23<br/>'
        f'Note: The last two routes are dynamic. User can specify only a start date or both start and end dates between 2010-01-01 and 2017-08-23, inclusive.'
    )

@app.route('/api/v1.0/precipitation')
def precipitation_prev_year():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    '''Return a JSON list of the previous 12 months of precipitation data'''
    # Query the most recent data point in the database
    end_date = session.query(measurement.date).\
        order_by(measurement.date.desc()).first()

    # Calculate the date one year from the last date in data set
    start_date = dt.datetime.strptime(end_date[0], '%Y-%m-%d') - dt.timedelta(days=365)

    # Perform a query to retrieve the dates and precipitation scores
    results = session.query(measurement.date, measurement.prcp).\
        filter(measurement.date>=start_date).all()
    session.close()
    
    # Return the JSON representation
    return jsonify(dict(results))

@app.route('/api/v1.0/stations')
def stations():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    '''Return a JSON list of stations'''
    # Query all station names
    results = session.query(station.name).all()
    session.close()

    return jsonify(list(np.ravel(results)))

@app.route('/api/v1.0/tobs')
def tobs():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    '''Return a JSON list of temperature observations for the previous year at the most active station'''
    # Query to find the most active station
    most_active_id = session.query(measurement.station, func.count(measurement.station)).\
        group_by(measurement.station).order_by(func.count(measurement.station).desc()).first()
    
    # Query the most recent data point for the most active station in the database
    end_date = session.query(measurement.date).\
        order_by(measurement.date.desc()).filter(measurement.station==most_active_id[0]).first()
    
    # Calculate the date one year from the last date in data set
    start_date = dt.datetime.strptime(end_date[0], '%Y-%m-%d') - dt.timedelta(days=365)

    # Perform a query to retrieve the temperatures with the above criteria
    results = session.query(measurement.tobs).\
        filter(measurement.date>=start_date).filter(measurement.station==most_active_id[0]).all()
    session.close()

    return jsonify(list(np.ravel(results)))

@app.route('/api/v1.0/<start>/')
@app.route('/api/v1.0/<start>/<end>')
# The same function can be used for routes since with only a specified start date, the end date is defaulted to the end of the dataset, which is 2017-08-23.
def t_between_dates(start, end='2017-08-23'):
    # Create our session (link) from Python to the DB
    session = Session(engine)

    '''Returns the min, max, and average temperatures calculated from the given start date to the end of the dataset or the given end date'''
    # Query to find the minimum, average, and maximum temperatures for a specified start-end range
    (tmin, tavg, tmax) = session.query(func.min(measurement.tobs), func.avg(measurement.tobs), func.max(measurement.tobs)).\
        filter(measurement.date>=start).filter(measurement.date<=end).first()
    session.close()
    return f'The minimum temperature, the average temperature, and the maximum temperature from {start} to {end} are {tmin:.1f}, {tavg:.1f}, and {tmax:.1f}.'

if __name__ == '__main__':
    app.run(debug=True)