import sqlite3
from flask import Flask, request, jsonify, render_template
import database_setup

database_setup.setup()
app = Flask(__name__)


# Get most popular video games by global sales. In Descending by default but also
# based on boolean ascending.
# Same for NA_Sales
# Same for EU_Sales
# Same for JP_Sales
# Order video games by rating by default descending order. But based on boolean ascending. This is a bonus
# Bonus, most popular rating by release date
# Make a Nav bar with materialize containing what sales to order game by.
# A switch in middle of screen below navbar to find whether to order by ascending or descending
# order.
# Test with Postman

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/games', methods=['GET'])
def get_games():
    """
    Returns a list of video games ordered by the specified column (NA_Sales, EU_Sales, JP_Sales, Global_Sales, Rating),
    either ascending or descending.
    :return: JSON response with games ordered by the selected column.
    """
    # Get the 'ascending' query parameter, default to False (descending)
    ascending = request.args.get('ascending', 'false').lower() == 'true'

    # Get the 'sort_by' query parameter to determine which column to sort by (NA_Sales, EU_Sales, JP_Sales,
    # Global_Sales, or Rating)
    sort_by = request.args.get('sort_by', 'Global_Sales')
    valid_columns = ['NA_Sales', 'EU_Sales', 'JP_Sales', 'Global_Sales', 'Rating']

    # If the 'sort_by' parameter is invalid, default to 'Global_Sales'
    if sort_by not in valid_columns:
        sort_by = 'Global_Sales'

    # Connect to the database (you can also specify a file-based database here)
    connection = sqlite3.connect(":memory:", check_same_thread=False)  # Replace with actual DB path if persistent
    cur = connection.cursor()

    # Create the table and insert sample data (for the sake of example)
    database_setup.create_video_game_database(connection, 100)

    # Build the ORDER BY clause based on the 'ascending' flag
    order_direction = "ASC" if ascending else "DESC"

    # Query the games ordered by the chosen column (e.g., NA_Sales, EU_Sales, Global_Sales, Rating)
    query = f'''
    SELECT Name, Platform, Year_of_Release, Genre, Publisher, NA_Sales, EU_Sales, JP_Sales, Rating, Global_Sales
    FROM video_games
    ORDER BY {sort_by} {order_direction}
    '''

    cur.execute(query)
    rows = cur.fetchall()

    # Prepare the response as a list of dictionaries
    games = [
        {
            "Name": row[0],
            "Platform": row[1],
            "Year_of_Release": row[2],
            "Genre": row[3],
            "Publisher": row[4],
            "NA_Sales": row[5],
            "EU_Sales": row[6],
            "JP_Sales": row[7],
            "Rating": row[8],
            "Global_Sales": row[9]
        }
        for row in rows
    ]

    # Close the connection
    connection.close()

    # Return the data as JSON
    return jsonify(games)


if __name__ == '__main__':
    app.run(debug=True, port=4000)
