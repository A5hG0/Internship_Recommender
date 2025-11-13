import pandas as pd
import numpy as np
import seaborn as sns
o_df = pd.read_csv("Z:/Python/Internship_Recommender/data/internship_finalP_dataset.csv")
df = o_df.copy() #Working on copy of the dataset
print(df.columns)
nul = df.isna().sum().sort_values(ascending = False)
dup = df.duplicated().sum()
# print(nul)
# print(dup)
print(df.isnull().sum())
# print(df.shape)
df = df.dropna()
# print(df.shape)
print(df.isnull().sum())
# df.to_csv("Z:/Python/Internship_Recommender/data/internship_finalP_dataset_v2.csv")
# nul = df.isna().sum().sort_values(ascending = False)
# dup = df.duplicated().sum()
# print(nul)
# print(dup)
# print(df.head())
c = np.array([[[1,2], [3,4]], [[5,6], [7,8]]]) # 3D
print(c.ndim)

df.rename(columns= {'Title' : 'Role'}, inplace= True)
print(df.head())

import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [10, 15, 13, 18, 16]
# plt.plot(x, y)
# plt.plot(x, y, color='red', marker='^')
data = [10, 20, 20, 30, 40, 40, 40, 50]
# plt.hist(data, bins=2, color='green')

sns.lineplot(x=[1,2,3,4], y=[10,20,15,25])
plt.show()

