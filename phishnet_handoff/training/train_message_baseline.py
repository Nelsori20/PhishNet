#!/usr/bin/env python3
"""Reproducible, optional UCI SMS spam-vs-ham baseline; NOT a PhishNet fraud safety model.

Requires actual user-provided original SMSSpamCollection file. No data is bundled.
Run: python training/train_message_baseline.py --data training/data/raw/SMSSpamCollection
"""
import argparse
import hashlib
import json
from pathlib import Path
from datetime import datetime, timezone
import re

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, precision_recall_fscore_support, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


def read_uci(path: Path):
    if not path.is_file():
        raise FileNotFoundError(f"Dataset not present: {path}. Download original UCI dataset first; no samples are bundled.")
    records = []
    for n, line in enumerate(path.read_text(encoding='utf-8', errors='replace').splitlines(),1):
        if '\t' not in line:
            continue
        lab,text = line.split('\t', 1)
        if lab not in {'ham','spam'} or not text.strip():
            continue
        records.append((lab,text.strip()))
    if len(records)<50:
        raise ValueError("Fewer than 50 valid labelled records; refusing to claim a meaningful training run")
    return records


def canon(text):
    return re.sub(r'\s+',' ',text.casefold().strip())


def train(src,output,seed):
    rows=read_uci(src)
    seen=set(); unique=[]
    for lab,txt in rows:
        key=canon(txt)
        if key not in seen:
            seen.add(key); unique.append((lab,txt))
    ys=np.array([int(lab=='spam') for lab,_ in unique]); texts=np.array([txt for _,txt in unique],dtype=object)
    if min(int((ys==0).sum()),int((ys==1).sum()))<10:
        raise ValueError('Each class requires >=10 unique records')
    # exact and whitespace/case normalized duplicates removed before split.
    X_temp, X_test, y_temp, y_test = train_test_split(texts,ys,test_size=.20,random_state=seed,stratify=ys)
    X_train, X_val, y_train, y_val = train_test_split(X_temp,y_temp,test_size=.125,random_state=seed,stratify=y_temp)
    model=Pipeline([('tfidf',TfidfVectorizer(ngram_range=(1,2),min_df=2,max_features=50000,sublinear_tf=True)),
                    ('clf',LogisticRegression(max_iter=2000,class_weight='balanced',random_state=seed))])
    model.fit(X_train,y_train)
    best_threshold=.5; best_f1=-1
    val_probs=model.predict_proba(X_val)[:,1]
    for threshold in np.arange(.20,.81,.05):
        pred=(val_probs>=threshold).astype(int)
        p,r,f,_=precision_recall_fscore_support(y_val,pred,average='binary',zero_division=0)
        if f>best_f1:best_f1=f;best_threshold=float(round(threshold,2))
    test_prob=model.predict_proba(X_test)[:,1]; predicted=(test_prob>=best_threshold).astype(int)
    p,r,f,_=precision_recall_fscore_support(y_test,predicted,average='binary',zero_division=0)
    cm=confusion_matrix(y_test,predicted,labels=[0,1]); tn,fp,fn,tp=cm.ravel()
    metrics={
       'task':'SMS spam-vs-ham ONLY; no phishing or agent-payment safety claim',
       'dataset':'UCI SMS Spam Collection', 'attribution':'Almeida & Hidalgo (2011), doi:10.24432/C5CC84',
       'license':'CC BY 4.0', 'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),
       'generated_utc':datetime.now(timezone.utc).isoformat(),
       'seed':seed, 'input_rows':len(rows),'unique_deduplicated_rows':len(unique),
       'splits':{'train':len(X_train),'validation':len(X_val),'test':len(X_test)},
       'class_counts_unique':{'ham':int((ys==0).sum()),'spam':int((ys==1).sum())},
       'decision_threshold_selected_on_validation':best_threshold,
       'test':{'accuracy':float(accuracy_score(y_test,predicted)),'spam_precision':float(p), 'spam_recall':float(r), 'spam_f1':float(f),'confusion_matrix_ham_spam':cm.tolist(),'false_positive_rate_ham':float(fp/(tn+fp))},
       'limitations':['Old SMS spam corpus: domain mismatch to real agentic finance.','Random split after deduplication; no time/domain/conversation-family holdout available.','No support for financial authorization or truthful provenance evaluation.','No production safety certification.']
    }
    output.mkdir(parents=True,exist_ok=True)
    joblib.dump(model,output/'sms_spam_baseline.joblib')
    (output/'metrics.json').write_text(json.dumps(metrics,indent=2)+'\n')
    print(json.dumps({'model':str(output/'sms_spam_baseline.joblib'),'metrics':str(output/'metrics.json'),'test':metrics['test']},indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--data',type=Path,required=True,help='Path to original UCI SMSSpamCollection file')
    parser.add_argument('--out',type=Path,default=Path('training/output'))
    parser.add_argument('--seed',type=int,default=42)
    a=parser.parse_args();train(a.data,a.out,a.seed)
