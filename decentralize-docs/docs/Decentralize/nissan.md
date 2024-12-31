---
sidebar_label: "Nissan"
sidebar_position: 2
---

# Nissan
The services available for the Nissan account include:
* Apprentice and Graduates Placement Tracking.
* Monthly Apprentice and Graduates RO's.
* Technician Tracking.

## Apprentice and Graduates Placement Tracking
There are 4 files that a user is typically required to upload. These include:
* Weekly NTTA Status Report for the first week
* Weekly NTTA Status Report for the second week
* Apprentice Placement Tracker - auto
* Graduates Placement Tracker - auto

The prompt for the weekly NTTA Status Reports would look something like this:
* `"Upload NTTA Status report for the week before the most recent week"`
* `"Upload NTTA Status report for the most recent week"`

For example, suppose the most recent file is dated November 29, 2024, and the immediately preceding file is dated November 22, 2024. In this case, the "most recent week's" NTTA Status Report would be the file dated November 29, 2024 (week 2), while the "previous week's" report would be the file dated November 22, 2024 (week 1).
The user would also be required to upload the Apprentice Placement Tracker file and the Graduates placement tracker file.
N/B: Please note that if in case the tracker file already contains a column with week 2 then the computation would not occur as that is the column that the computation seeks to fill. The output at the end would be the same file that was uploaded. Therefore, please ensure to keep track of the columns already computed.
After the computation, the user will be prompted to download the generated report which can then now be uploaded to the SharePoint site.
Below is the pseudocode summary for the whole process:
```python
# Steps:
# Load the excel file as a dataframe and clean the dataframe
# 1. Check for and obtain new and transitioned students, and either apprentices
#    or graduates who have dropped off - by tracking the LMSID column from
#    previous weeks and comparing to the values of the current week
# 2. Still using LMSID, mark the statuses of the students:

For apprentices in the prior week: # Active last week
     if LMSID in the current week apprentices: # If active last week and this week
          mark as 1 (ongoing)
     else: # active last week and absent this week
          if LMSID in transitioned_students: # If transitioned
               mark as 0
          
          else: # Neither present nor transitioned
               mark as '-'
               
For graduates in prior week:
     if LMSID in current week graduates: # active
          mark as 1
     else:
     mark as '-' # dropped off / absent during that week
     
# 3. update that week's column in the dataframe - for both graduates and apprentices
# 4. Calculate the number of transitioned students during that week
# 5. Find the number of transitioned students during the financial year

# Save the file
```

## ROI and ROI by School
The user would be required to fill out the of the period the RO Trend file seeks to generate reports for. This date is not the date of the file itself but of the month before it. For instance, if the date of the RO trend file is dated as 11/09/2024 then the period being computed is October 2024.
The user would then be prompted to upload the RO Trend files for both the Apprentices and the Fulltime Graduates alongside the correct NTTA Status Report. For instance, we have been computing the values for October 2024, the correct NTTA report for this would be the first NTTA Status report in the month of November 2024.
The logic used in generating the reports is as follows:
```python
# Steps:
## -- ROI -- ##
# 1. Get the number of apprentices and graduates from the 
# respective RO trend files
# 2. Get the number of apprentices and graduates from the appropriate
# weekly NTTA Status report file

# 3. Get the sum totals for the apprentices & graduates RO as illustrated:
app_part_total_cost = np.sum(month_app_ro["PART_TOTAL_COST"])
app_part_total_price = np.sum(month_app_ro["PART_TOTAL_PRICE"])
app_lbr_amt = np.sum(month_app_ro["LABOR_AMT"])

# 4. Make the monthly calculations
# Calculations for Apprentices
app_ro_parts = 0.35
app_part_total_cost_adj1 = app_part_total_cost/(1-app_ro_parts) # Part total cost adjusted 1
app_ro_parts_lbr_dms_pct = (n_ntta_apps-n_ro_apps)/n_ntta_apps # RO parts labor dms percent
if app_ro_parts_lbr_dms_pct < 0: # Setting 0 as the minimum threshold
    app_ro_parts_lbr_dms_pct = 0
else:
    app_ro_parts_lbr_dms_pct = app_ro_parts_lbr_dms_pct
app_part_total_cost_adj1_2 = (app_part_total_cost/(1-app_ro_parts))/(1-app_ro_parts_lbr_dms_pct)# Part total cost adjusted 1+2
app_part_total_price_adj1_2 = app_part_total_price/(1-app_ro_parts)/(1-app_ro_parts_lbr_dms_pct)# Part total price adjusted 1+2
app_lbr_amt_adj1_2 = app_lbr_amt/(1-app_ro_parts)/(1-app_ro_parts_lbr_dms_pct) # Labor amount adjusted 1+2
app_p_l_adj1_2 = (app_part_total_price+app_lbr_amt)/(1-app_ro_parts)/(1-app_ro_parts_lbr_dms_pct)

# Calculations for Graduates
grad_ro_parts_lbr_dms_pct = (n_ntta_grads-n_ro_grads)/n_ntta_grads # RO parts labor dms percent
grad_part_total_cost_adj2 = grad_part_total_cost/(1-grad_ro_parts_lbr_dms_pct) # Part total cost adjusted 1+2
grad_part_total_price_adj1_2 = grad_part_total_price/(1-grad_ro_parts_lbr_dms_pct) # part total price adjusted 1+2
grad_lbr_amt_adj1_2 = grad_lbr_amt/(1-grad_ro_parts_lbr_dms_pct) # Labor amount adjusted 1+2
grad_p_l_adj2 = (grad_part_total_price+grad_lbr_amt)/(1-grad_ro_parts_lbr_dms_pct) # P & L adjusted 2

# Total P & L
total_p_l = app_p_l_adj1_2+grad_p_l_adj2

# Total NNA Revenue
total_nna_rev = app_part_total_cost_adj1_2+grad_part_total_cost_adj2

# 5. Calculate moving average - projections for the remainder of the financial year
# 6. Save the file

## -- ROI by School -- ##
# 1. Get the schools that both the Apprentices and the Graduates registered to in that month
# 2. Map the students (from the RO dfs above) to their respective schools (from the NTTA tracker)
# Schools recorded as NaN are marked as unkown
month_app_ro['APP_School'] = month_app_ro['APP_EMPLOYEESTUDENT_FULLNAME'].map(app_schools)
month_grad_ro['GRAD_School'] = month_grad_ro['GRAD_EMPLOYEE_STUDENTFULLNAME'].map(grad_schools)

# 3. Calculate the revenue generated by dealer from the col DEALER_REV($)
month_app_ro['APP_DEALER_REV($)'] = month_app_ro['APP_PART_TOTAL_PRICE']+month_app_ro['APP_LABOR_AMT'] # apprentices
month_grad_ro['GRAD_DEALER_REV($)'] = month_grad_ro['GRAD_PART_TOTAL_PRICE']+month_grad_ro['G

# 4. Get the revenue generated by the school
app_rev_by_sch = pd.DataFrame(month_app_ro.groupby(['APP_School']).sum()['APP_DEALER_REV($)'])
grad_rev_by_sch = pd.DataFrame(month_grad_ro.groupby(['GRAD_School']).sum()['GRAD_DEALER_REV($)'])

# 5. Save the file
```

The user would then be asked to download the generated reports which can then be uploaded to the SharePoint site.

## Technician Tracking
The user would be required to input the number of online registration files uploaded during that session. The user would also be prompted to upload the current week's NTTA Status report. The user has access to a feature that allows for downloading the generated report.
The pseudocode logic is as follows:

```python
# Steps:
# 1. Concatenate online registration dfs
# 2. Upload weekly NTTA Status report
# 3. Perform a hierarchical match
    # At the first level, look for a perfect match on name and school
    # At the second level, look for a match on First and Last Name with School
    
# 4. Get the leads that later enrolled
# 5. Find the conversion rate per school
# 6. Create an excel file with 2 sheets (conversion rate by school & 
```