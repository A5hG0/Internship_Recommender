import pandas as pd
import numpy as np

o_df = pd.read_csv("internships.csv")
df = o_df.copy() #Working on copy of the dataset
nul = df.isna().sum().sort_values(ascending = False)
dup = df.duplicated().sum()
print(nul)
print(dup)
df.dropna()
# print(df.head())