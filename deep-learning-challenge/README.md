# Venture Success Analysis for Alphabet Soup

## Overview

The purpose of this analysis is to develop a binary classifer to help the non-profit foundation Alphabet Soup select the applicants for funding with the best chance of success in their ventures. The model chosen for this classification task is a deep neural network. It is trained and tested using a dataset that contains more than 34,000 applications that have received funding from Alphabet Soup over the years. Given the features of each funded application, the model predicts whether or not the money is used effectively. 

## Results

* Data Preprocessing
  * The `IS_SUCCESSFUL` variable is the only target for the model, i.e., what the model aims to predict. `1`'s mean effective use of funding and `0`'s otherwise.
  * The following variables are the features for the model:
    * `APPLICATION_TYPE`: Alphabet Soup application type
    * `AFFLIATION`: affiliated sector of industry
    * `CLASSIFICATION`: government organization classification
    * `USE_CASE`: use case for funding
    * `ORGANIZATION`: organization type
    * `STATUS`: active status
    * `INCOME_AMT`: income classification
    * `SPECIAL_CONSIDERATIONS`: special considerations for application
    * `ASK_AMT`: funding amount requested
  * `APPLICATION_TYPE` and `CLASSIFICATION` are both categorical variables with more than 10 unique values. As a result, a cutoff point for value counts is chosen to bin rare values together in a new value, `Other`.
  * If a variable has no bearing on the outcome of a venture, it is not considered a feature and is dropped accordingly. `EIN` is one such variable since it is an identifier unique for each application in the dataset. Similarily, `NAME`, which is the name of an organization, should be dropped from the input data. (There is more to said about `NAME` for model optimization.)
  * The number of input features after converting categorical data to numerical data totals 43.

* Compiling, Training, and Evaluating the Model
    * The initial model, in addition to its input and output layers, has two hidden layers, which is a good starting point for deep learning optimization. Since 2 to 3 times as many neurons are often used as there are input features, 80 neurons are assigned to the first hidden layer and 40 neurons are assigned to the second hidden layer, following the convention to size the hidden layers to form a pyramid, with fewer and fewer neurons at each layer. `relu` is selected as the activation function for both hidden layers. `sigmoid` is chosen as the activation function for the output layer, considering that the model target is binary. The [initial model](analysis/AlphabetSoupCharity.ipynb) is able to achieve 72.9% accuracy on the testing data.
    * Several steps have been taken to optimize the initial model:
        * A closer look at the original dataset reveals that a single organization can have multiple funded applications (and in some cases, hundreds of funded applications), which could impact the success of its ventures. As a result, the number of applications associated with each organization is extracted as a separate input feature, `APP_COUNT`, for the model. `NAME`, which is used to group organizations to create `APP_COUNT`, is removed from the input data afterwards.
        * The cutoff point for value counts is lowered for `CLASSIFICATION` from 1000 to 100, effectively creating more bins and decreasing the number of values for the `Other` bin. Note that this in turn creates more input features for the model as a result of one-hot representation, which is taken into account for the next step of optimization.
        * The number of neurons for the first and second hidden layers are increased to 100 and 50, respectively, in accordance with the increase in the input features (from 43 to 50). In addition, a third hidden layer is added with 25 neurons.
    * The [improved model](analysis/AlphabetSoupCharity_Optimization.ipynb) is able to achieve 75.4% accuracy on the testing data, thereby hitting the performance goal. Its training history is shown below.
    ![training history](results/training_accuracy_vs_epoch.png)

## Summary

The deep neural network created is able to achieve higher than 75% accuracy. Since a binary classifer is needed to predict whether or not the money is used effectively, an alternative solution is a logistic regression model, which estimates the probability that an instance belongs to a particular class. In this case, if the estimated probablity is greater than 50%, the model predicts that the instance belongs to the positive class, i.e., the money is used effectively.
