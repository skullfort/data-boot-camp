# Credit Risk Classification Analysis

## Overview

The purpose of this analysis is to evaluate two supervised machine learning (ML) models on how well they identify the creditworthiness of borrowers for a peer-to-peer lending services company based on a dataset of historical loan records. Given the financial information of a loan, the ML models predict its status, i.e., whether it is healthy or has a high risk of defaulting. The financial information is represented by the following columns in the dataset: loan size, interest rate, borrower income, debt to income ratio, number of accounts, derogatory marks, and total debt. The loan status is represented by numerical values: `0`'s mean healthy loans amd `1`'s high-risk loans.

To build the ML models, the dataset is first split into training and testing sets. A logistic regression classifer is then created and fit using the training set. Once trained, the classifer takes in the financial information of each loan in the testing set and predicts its risk status. The predicted results are in turn compared to the expected outcomes to evaluate the model performance. The two ML models differ in the training data composition. Where Model 1 uses the training data obtained from the `train_test_split()` function, Model 2 resamples the training data so that there is an equal number of healthy and high-risk loans.

## Results

* Machine Learning Model 1:
  * It produces a balanced accuracy score of 0.952.
  * For healthy loans, it produces a precision score of 1.00 and a recall score of 0.99.
  * For high-risk loans, it produces a precision score of 0.85 and a recall score of 0.91.

* Machine Learning Model 2:
  * It produces a balanced accuracy score of 0.994.
  * For healthy loans, it produces a precision score of 1.00 and a recall score of 0.99.
  * For high-risk loans, it produces a precision score of 0.84 and a recall score of 0.99.

## Summary

For healthy loans, both models are able to predict them with nearly perfect precision and recall. However, for credit risk classification, it is more important to correctly identify the high-risk loans, which Model 2 achieves with a recall score of 0.99 (in comparison with 0.91 by Model 1) and without much trade-off in the precision score. Therefore, in summary, Model 2 is recommended.
