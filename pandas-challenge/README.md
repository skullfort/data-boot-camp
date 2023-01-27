# pandas-challenge

01/13/2023

PyCitySchools.ipynb contains all the codes and results for this assignment. The jupyter kernel provided by the instructor has been used to run the notebook.

While a sample solution has been provided with this assignment, my codes deviate in a few areas where different DataFrame manipulations have been employed. Comments have been added to document these changes and the results have been checked to ensure accuracy. 

In the process of comparing results, I noticed discrepancies between my results and those in the sample solution in the `11th` columns for both `math_scores_by_grade` and `reading_scores_by_grade` DataFrames (under the sections "Math Score by Grade" and "Reading Score by Grade"). After conferring with an AskBSC Learning Assistant, two errata in the sample solution in the form of including `.mean()` in `eleventh_grader_math_scores = eleventh_graders_scores.mean()["math_score"]` and `eleventh_grader_reading_scores = eleventh_graders_scores.mean()["reading_score"]` were identified by the assistant, who mentioned that they would be reported to those making the curriculum.
