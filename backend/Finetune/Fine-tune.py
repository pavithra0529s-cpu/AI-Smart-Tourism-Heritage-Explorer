from openai import OpenAI

import os
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
file_id = client.files.create(
  file=open("dataset.jsnol", "rb"),
  purpose="fine-tune"
)

job_id = client.fine_tuning.jobs.create(
  training_file=file_id.id,
  model="gpt-4o-mini-2024-07-18"
)

print(file_id.id,job_id.id)
import time
print(client.fine_tuning.jobs.retrieve(job_id.id))

print(client.fine_tuning.jobs.retrieve(job_id.id))
while True:
    a=(client.fine_tuning.jobs.retrieve(job_id.id))
    print(a)
    if(a.status == 'succeeded'):
        break
    if(a.status == "failed"):
        break
    else:
        time.sleep(5)

print(client.fine_tuning.jobs.retrieve(job_id.id))
