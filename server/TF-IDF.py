import pandas as pd
import json
import operator
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.corpus import stopwords 
nltk.download('stopwords')

jobsFile = pd.read_csv("jobs-skills-data.csv")
resumesFile = pd.read_csv("resume-skill.csv")
stopset = set(stopwords.words('english'))

tfidf_vectorizer = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0, stop_words=stopset)
jobs_matrix = tfidf_vectorizer.fit_transform(jobsFile['Skills'].astype(str))
resumes_matrix = tfidf_vectorizer.transform(resumesFile['Skills'])

matchingJobsList = []
matchingRate = 0
for idx in range(len(jobsFile)):
	similarScore = cosine_similarity(jobs_matrix[idx],resumes_matrix[0])
	if similarScore > matchingRate:
		matchingJobsList.append(
			{
			"id": idx, 
			"title": jobsFile['title'][idx], 
			"score": similarScore[0][0], 
			"url": jobsFile['url'][idx],
			"source": jobsFile['source'][idx]
			})

topTenMatchingJobs = sorted(matchingJobsList, key=operator.itemgetter('score'), reverse=True)[:10]
print(json.dumps(topTenMatchingJobs))
