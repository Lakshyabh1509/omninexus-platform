import logging
import time
from typing import List, Callable, Dict
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Task:
    def __init__(self, name: str, func: Callable, retries: int = 3):
        self.name = name
        self.func = func
        self.retries = retries

    def run(self, context: Dict):
        attempt = 0
        while attempt <= self.retries:
            try:
                logger.info(f"Starting task: {self.name}")
                result = self.func(context)
                logger.info(f"Task {self.name} completed successfully.")
                return result
            except Exception as e:
                attempt += 1
                logger.error(f"Task {self.name} failed (Attempt {attempt}/{self.retries + 1}): {str(e)}")
                if attempt > self.retries:
                    raise e
                time.sleep(1)

class DAG:
    def __init__(self, name: str):
        self.name = name
        self.tasks: List[Task] = []

    def add_task(self, task: Task):
        self.tasks.append(task)

    def run(self):
        logger.info(f"Starting DAG: {self.name}")
        context = {"start_time": datetime.now()}
        for task in self.tasks:
            try:
                context[task.name] = task.run(context)
            except Exception as e:
                logger.critical(f"DAG {self.name} failed at task {task.name}. Stopping execution.")
                return False
        logger.info(f"DAG {self.name} completed successfully.")
        return True

# --- Example ETL Tasks ---

def extract_market_data(context):
    # Simulate API call
    time.sleep(0.5)
    return [{"ticker": "AAPL", "price": 150}, {"ticker": "GOOGL", "price": 2800}]

def transform_normalize(context):
    data = context.get("extract_market_data")
    if not data:
        raise ValueError("No data to transform")
    return [
        {**item, "normalized_price": item["price"] / 100} 
        for item in data
    ]

def load_to_warehouse(context):
    data = context.get("transform_normalize")
    # Simulate DB insert
    logger.info(f"Inserting {len(data)} records into Data Warehouse.")
    return "Success"

if __name__ == "__main__":
    pipeline = DAG("MarketData_Ingestion_Pipeline")
    pipeline.add_task(Task("extract_market_data", extract_market_data))
    pipeline.add_task(Task("transform_normalize", transform_normalize))
    pipeline.add_task(Task("load_to_warehouse", load_to_warehouse))
    
    pipeline.run()
