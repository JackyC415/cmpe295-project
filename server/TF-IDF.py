import pandas as pd
import json
import operator
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
import pdmongo as pdm
from nltk.corpus import stopwords 
nltk.download('stopwords')

jobsFile = pdm.read_mongo("jobs", [], "mongodb://localhost:27017/cmpe295")
resumesFile = pd.read_csv("resumes-data.csv")
stopset = set(stopwords.words('english'))

tfidf_vectorizer = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0, stop_words=stopset)
job_skills_matrix = tfidf_vectorizer.fit_transform(jobsFile['Skills'].astype('U'))
resume_skills_matrix = tfidf_vectorizer.transform(resumesFile['Skills'])

matchingJobsList = []
matchingRate = 0.0
for idx in range(len(jobsFile)):
	skills_similarity_score = cosine_similarity(job_skills_matrix[idx],resume_skills_matrix[0])
	
	if skills_similarity_score > matchingRate:
		matchingJobsList.append({ "jid": idx, "score": skills_similarity_score[0][0] })

topTenMatchingJobs = sorted(matchingJobsList, key=operator.itemgetter('score'), reverse=True)[:50]
print(json.dumps(topTenMatchingJobs))
