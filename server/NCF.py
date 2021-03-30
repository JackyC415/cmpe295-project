import sys
sys.path.append("../../")
import os
import shutil
import papermill as pm
import scrapbook as sb
import pandas as pd
import numpy as np
import tensorflow as tf
import json
tf.get_logger().setLevel('ERROR') # only show error messages

from reco_utils.common.timer import Timer
from reco_utils.recommender.ncf.ncf_singlenode import NCF
from reco_utils.recommender.ncf.dataset import Dataset as NCFDataset
from reco_utils.dataset import movielens
from reco_utils.dataset.python_splitters import python_chrono_split
from reco_utils.evaluation.python_evaluation import (rmse, mae, rsquared, exp_var, map_at_k, ndcg_at_k, precision_at_k, 
                                                     recall_at_k, get_top_k_items)
from reco_utils.common.constants import SEED as DEFAULT_SEED

TOP_K = 10

# Select MovieLens data size: 100k, 1m, 10m, or 20m
MOVIELENS_DATA_SIZE = '10k'

# Model parameters
EPOCHS = 100
BATCH_SIZE = 256

SEED = DEFAULT_SEED  # Set None for non-deterministic results

# df = movielens.load_pandas_df(
#     size=MOVIELENS_DATA_SIZE,
#     header=["userID", "itemID", "rating", "timestamp"]
# )

df = pd.read_csv('ratings.csv')

print(df.head(n=10))

train, test = python_chrono_split(df, 0.75)
data = NCFDataset(train=train, test=test, seed=SEED)

model = NCF (
    n_users=data.n_users, 
    n_items=data.n_items,
    model_type="NeuMF",
    n_factors=4,
    layer_sizes=[16,8,4],
    n_epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    learning_rate=1e-3,
    verbose=10,
    seed=SEED
)

with Timer() as train_time:
    model.fit(data)

print("Took {} seconds for training.".format(train_time.interval))

predictions = [[row.userID, row.itemID, model.predict(row.userID, row.itemID)]
               for (_, row) in test.iterrows()]


predictions = pd.DataFrame(predictions, columns=['userID', 'itemID', 'prediction'])

#pass json to UI
predictionJSON = predictions.to_json(orient='records')

#output first five predictions in CLI
print(predictions.head())