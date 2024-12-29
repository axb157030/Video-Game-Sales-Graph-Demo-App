import sqlite3
import random
import faker

# Initialize Faker to generate random data
fake = faker.Faker()

# Sample data for Platforms, Genres, and Publishers
platforms = ['PlayStation 4', 'Xbox One', 'PC', 'Nintendo Switch', 'PlayStation 3', 'Xbox 360', 'Wii', 'PC',
             'Xbox One X', 'Nintendo 3DS']
genres = ['Action', 'Adventure', 'RPG', 'Shooter', 'Sports', 'Simulation', 'Puzzle', 'Strategy', 'Fighting', 'Racing']
publishers = ['Electronic Arts', 'Activision', 'Ubisoft', 'Sony Interactive Entertainment', 'Nintendo',
              'Bethesda Softworks', 'Square Enix', 'Bandai Namco', 'Take-Two Interactive', 'Capcom']


def create_video_game_database(connection, num_records=100):
    """
    Creates a SQLite database with a table of video games including random sales data and ratings.

    :param db_name: Path to the SQLite database file (use ":memory:" for an in-memory database).
    :param num_records: The number of sample records to insert into the database.
    :return: A connection object to the database.
    """
    # Connect to SQLite (either in-memory or file-based)
    cur = connection.cursor()

    # Create the video_games table
    cur.execute('''
    CREATE TABLE video_games (
        Name TEXT,
        Platform TEXT,
        Year_of_Release INTEGER,
        Genre TEXT,
        Publisher TEXT,
        NA_Sales REAL,
        EU_Sales REAL,
        JP_Sales REAL,
        Rating REAL,
        Global_Sales REAL
    )
    ''')

    # Function to generate random sales data
    def generate_sales():
        return round(random.uniform(0.1, 20.0), 2)

    # Function to generate a random rating
    def generate_rating():
        return round(random.uniform(0.0, 10.0), 1)

    # Insert random records into the video_games table
    for _ in range(num_records):
        name = fake.bs().title()  # Generate a random game title
        platform = random.choice(platforms)
        year_of_release = random.randint(1990, 2024)
        genre = random.choice(genres)
        publisher = random.choice(publishers)
        na_sales = generate_sales()
        eu_sales = generate_sales()
        jp_sales = generate_sales()
        rating = generate_rating()  # Generate rating between 0.0 and 10.0
        global_sales = round(na_sales + eu_sales + jp_sales, 2)  # Sum of sales for global sales

        cur.execute('''
        INSERT INTO video_games (Name, Platform, Year_of_Release, Genre, Publisher, NA_Sales, EU_Sales, JP_Sales, Rating, Global_Sales)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, platform, year_of_release, genre, publisher, na_sales, eu_sales, jp_sales, rating, global_sales))

    # Commit the transaction
    connection.commit()

    # Return the connection object



# Example usage
def setup():
    connection = sqlite3.connect(":memory:")
    create_video_game_database(connection, 100)  # Creating the database with 100 records

# Query and print the first 10 rows to verify


