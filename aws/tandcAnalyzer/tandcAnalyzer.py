import uuid
# import multiprocessing as mp
import time
import json
# import pandas as pd
import boto3
from multiprocessing import Process,  Pipe
import re
import random
# import numpy as np
import openai
# from keybert import KeyBERT
random.seed(42)
openai.api_key = ""


def openai_prompt(prompt, tok, used_for, bo, use):
    try:
        if use == "Turbo":
            time.sleep(3)

#             response = openai.ChatCompletion.create(
#                 model="gpt-3.5-turbo",
            response= openai.ChatCompletion.create(
                  model="gpt-3.5-turbo-16k-0613",
                #     messages=[
                #         {"role": "user", "content": f"Generate an Image Prompt by following these Instructions: {prompt_final}"},
                #     ],
                messages=[
                    {"role": "user", "content": f"{prompt}"},
                ],
                temperature=0,
                top_p=1,
                max_tokens=tok,
                frequency_penalty=0,
                presence_penalty=0,
            )
            res_ini = response.choices[0].message['content']
            token_used = response["usage"]['total_tokens']
            price = 0.002*token_used/1000

        else:
            time.sleep(3)

            response = openai.Completion.create(
                model="text-davinci-003",
                prompt=prompt,
                max_tokens=tok,
                temperature=0,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0,
                best_of=bo,

                stop=[" END"]
            )
            res_ini = response['choices'][0]['text']
            token_used = response['usage']['total_tokens']
            price = 0.02*token_used/1000
        print(f"Response from {use} for {used_for} : {res_ini}")
        print(f'Number Of Tokens USed for {used_for}: {token_used}')
        print(f'Finish Reason: {response["choices"][0]["finish_reason"]}')
        print(f"Price for This Call: {price}")

# except openai.exceptions.OpenAIError as e:
    except Exception as e:        # handle the error
        time.sleep(1)
        print(f'Request failed: {e}')
        print("Retrying")
        return "Retry", 0, 0

    print("DFS QM")
    # if used_for=="single_cluster Article Questions" and used_for != "Meta Description" and used_for != "Dup Regen Answers" and used_for != "Title Tag" and used_for != "Tagline" and used_for != "Tagline Description" and used_for != "FAQs_Q" and used_for != "FAQ_A" and used_for != "Answers":
    # if used_for == "single_cluster Article Questions" or used_for == "multi_cluster Article Questions":

    #     h2_final = clean_string(res_ini)
    #     print(type(h2_final))
    #     print(h2_final)
    #     print(len(h2_final))
    #     res = h2_final

    # else:
#     if '"' in res_ini:
#         res = res_ini.split('"')[1].strip()

#     else:
#         res = res_ini.strip()
    try:
        h2_final =res_ini
        print(type(h2_final))
        print(h2_final)
        print(len(h2_final))
        res = h2_final
    except:
        res = res_ini
        
    return res, token_used, price



def openai_handler(prompt, tok, used_for, bo):
    response, ttoken_used, price = openai_prompt(
        prompt, tok, used_for, 1, "Turbo")
    if response == "Retry":
        for k in range(0, 3):
            print(f"Retrying {used_for}")
            response, ttoken_used, price = openai_prompt(
                prompt, tok, used_for, bo, "GPT3")
            if response != "Retry":
                print("Got It")
                break
    return response, ttoken_used, price


def lambda_handler(event, context):
    _start = time.time()

    print("Start")

    #######################################
    #           AWS Information           #
    #######################################
    final_destination = "Extension/Final"
    ini_destination = "Extension_ini"
    
    bucket_name = "seo-content-ai"
    interlinking_name = "Interlinking"
    content = "Content"
    final = "Final"
    # user_input=f"{final_destination}/{user_id}/{content_type}/{project_title}_{date}/[roject_title_input.json"
    # user_input_history=message
    # file_ini=f"{ini_destination}/{user_id}/{content_type}/{project_title}_{date}/"
    # file_final=f"{final_destination}/{user_id}/{content_type}/{project_title}_{date}/"
    # final_file= f"{file_ini}{project_title}.json"
    print(event)
    # message = json.loads(event)
    message = json.loads(event["body"])
    

    print(f"Body: {message}")
    # status= message["status"]
    # use_type="extension"    
    TandC=message["page_data"]
    # project_title=message["project_title"]
    # counts=message["counts"]
    # additional=message["additional"]
    # date=message["date"]
    # content_language=message["content_language"]
    # img_generation=message["img_generation"]
    # datetime=message["datetime"]
    # project_id=message["project_id"]
    # use_type="Extension"
    # api_key=message["api_key"]
    # message["use_type"]=use_type
    # interlinking=False
    ## Get Mail and User ID
    # email,user_id=get_mail_usedid(api_key)
    ## Check if Project already exists or not
    # check_project=check_project_exists(project_title,user_id,email)
    ## Word Count
    # check_count=can_generate(email,user_id,counts)
    ## Article Check
    # check_quality=dirty_check(page_data)

    print("---------------")
    print(TandC)
    prompt=f"""Prompt Instructions: Analyze a given set of Terms and Conditions (T&C) text and generate two distinct responses each response should be of 3 points. In the first response, highlight points that can be potentially harmful or disadvantageous to the user when agreeing to the T&C. In the second response, identify and emphasize points that can be advantageous or beneficial to the user within the same T&C text.
    \n\nInput Field 1: {TandC} // Required

    This prompt will guide users to input the T&C text, and the model will generate two responses—one focusing on harmful points and the other on beneficial points within the provided text. Users can easily understand the implications of the T&C by reading these two distinct perspectives."""
    res=openai_handler(prompt, 1000, "TandC", 1)
    negRes="1."+ res[0].split("\n\n1.")[1].split("Response 2:")[0]

    posRes="1."+ res[0].split("\n\n1.")[2]

    res_fin={}
    res_fin["response"]={"Negrative Response":negRes,"Positive Response": posRes}
    res_fin['headers']= {
            'Content-Type': 'application/json',}
    print(f"Result to Send:{res_fin}")
    print(f"Sequential execution time: {time.time() - _start} seconds")

    return res_fin
