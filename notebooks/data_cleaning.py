import pandas as pd
import numpy as np

o_df = pd.read_csv("Z:/Python/Internship_Recommender/data/internship_finalP_dataset.csv")
df = o_df.copy() #Working on copy of the dataset
nul = df.isna().sum().sort_values(ascending = False)
dup = df.duplicated().sum()
# print(nul)
# print(dup)
print(df.isnull().sum())
# print(df.shape)
df = df.dropna()
# print(df.shape)
print(df.isnull().sum())
df.to_csv("Z:/Python/Internship_Recommender/data/internship_finalP_dataset_v2.csv")
# nul = df.isna().sum().sort_values(ascending = False)
# dup = df.duplicated().sum()
# print(nul)
# print(dup)
# print(df.head())