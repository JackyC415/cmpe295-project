import pandas as pd
import json
import operator
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.corpus import stopwords 
nltk.download('stopwords')

jobsFile = pd.read_csv("jobs-data.csv")
resumesFile = pd.read_csv("resumes-data.csv")
stopset = set(stopwords.words('english'))

tfidf_vectorizer = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0, stop_words=stopset)
job_skills_matrix = tfidf_vectorizer.fit_transform(jobsFile['Skills'])
resume_skills_matrix = tfidf_vectorizer.transform(resumesFile['Skills'])

# tfidf_vectorizer2 = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0, stop_words=stopset)
# job_description_matrix = tfidf_vectorizer2.fit_transform(jobsFile['description'])
# resume_description_matrix = tfidf_vectorizer2.transform(resumesFile['description'])

matchingJobsList = []
matchingRate = 0.0
for idx in range(len(jobsFile)):
	skills_similarity_score = cosine_similarity(job_skills_matrix[idx],resume_skills_matrix[0])
	# description_similarity_score = cosine_similarity(job_description_matrix[idx],resume_description_matrix[0])
	# total_similarity_score = skills_similarity_score + description_similarity_score
	
	if skills_similarity_score > matchingRate:
		matchingJobsList.append(
			{
			"id": idx, 
			"title": jobsFile['title'][idx], 
			"score": skills_similarity_score[0][0], #+ description_similarity_score[0][0], 
			"url": jobsFile['url'][idx],
			"source": jobsFile['source'][idx],
			"company": jobsFile['company_name'][idx],
			"description": str(jobsFile['description'][idx])
			})

topTenMatchingJobs = sorted(matchingJobsList, key=operator.itemgetter('score'), reverse=True)[:4]
print(json.dumps(topTenMatchingJobs))
