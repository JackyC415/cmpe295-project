import pandas as pd
import json
import operator
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

jobsFile = pd.read_csv("jobsData.csv")
resumesFile = pd.read_csv("resumeData.csv")

tfidf_vectorizer = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0, stop_words='english')
jobs_matrix = tfidf_vectorizer.fit_transform(jobsFile['description'])
resumes_matrix = tfidf_vectorizer.transform(resumesFile['description'])

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