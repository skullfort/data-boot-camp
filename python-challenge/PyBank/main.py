# Import the modules needed for this assignment 
import os # for constructing file paths compatible for different operating systems
import csv # for reading tabular data in csv format

# Read the budget data into separate lists
with open(os.path.join('Resources', 'budget_data.csv')) as csvfile:
    # Create a reader object to iterate over lines in budget_data.csv
    csvreader = csv.reader(csvfile, delimiter=',')
    # Read the header row
    csvheader = next(csvreader)
    # Create 3 empty lists: month, gain, and change
    month, gain, change = ([] for i in range(3))
    # Read each row of data after the header
    for row in csvreader:
        month.append(row[0]) # first column of each row read corresponds to the month of a year
        gain.append(int(row[1])) # second column of each row read corresponds to the monthly gain (i.e. profits/losses)
 
# Starting from the second row of the budget data, subtracting the gain of the previous row from the gain of the current row yields the change in monthly profits/losses 
for i in range(1,len(gain)):
    change.append(gain[i]-gain[i-1])

# Compile the calculated results into a single f-string for terminal output and file export
result = (
    f'Financial Analysis\n'
    f'----------------------------\n'
    f'Total Months: {len(month)}\n'
    f'Total: ${sum(gain)}\n'
    f'Average Change: ${sum(change)/len(change):.2f}\n' # alternatively, f'Average Change: ${(gain[len(month)-1]-gain[0])/(len(month)-1):.2f}\n'
    f'Greatest Increase in Profits: {month[change.index(max(change))+1]} (${max(change)})\n' # change's indices lag month's indices by 1 when they refer to the same month
    f'Greatest Decrease in Profits: {month[change.index(min(change))+1]} (${min(change)})'
)

# Output the findings to the terminal
print(result)

# Output the findings to a text file
with open(os.path.join('analysis', 'result.txt'), 'w') as textfile:
    textfile.write(result)