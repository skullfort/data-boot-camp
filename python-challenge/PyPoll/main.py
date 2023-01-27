# Import the modules needed for this assignment 
import os # for constructing file paths compatible for different operating systems
import csv # for reading tabular data in csv format

# Read the poll data into a dictionary
with open(os.path.join('Resources', 'election_data.csv')) as csvfile:
    # Create a reader object to iterate over lines in election_data.csv
    csvreader = csv.reader(csvfile, delimiter=',')
    # Read the header row
    csvheader = next(csvreader)
    # Construct a dictionary to be filled with candidates as keys and vote counts as values
    election = {}
    # Read each row of data after the header
    for row in csvreader:
        # If the candidate named by the vote appears as one of the keys, add the vote count for the candidate by 1
        if row[2] in election.keys():
            election[row[2]] +=1
        # Otherwise, create a new key-value pair with the candidate as the key and a starting vote count of 1
        else:
            election.update({row[2]:1})

# Compile the calculated results into a list of strings using f-strings, dictionary comprehension, and extend()
result = ['Election Results', '-------------------------', f'Total Votes: {sum(election.values())}', '-------------------------'] # {sum(election.values())}: the sum of votes for every candidate gives the total number of votes cast
result.extend([f'{candidate}: {votes/sum(election.values()):.3%} ({votes})' for candidate, votes in election.items()]) # {votes/sum(election.values()):.3%}: percentage of total votes formatted with 3 decimal places
# Convert the candidates and votes won to separate lists to determine the winner of the election, i.e. the candidate sharing the same index as the most votes won in their respective lists
result.extend(['-------------------------', f'Winner: {list(election.keys())[list(election.values()).index(max(election.values()))]}', '-------------------------'])

# Convert the list to a single string using join() by a newline character
# Output the findings to the terminal
print('\n'.join(result))
# Output the findings to a text file
with open(os.path.join('analysis', 'result.txt'), 'w') as textfile:
    textfile.write('\n'.join(result))