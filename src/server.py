from flask import Flask, render_template, url_for, request, jsonify
from SPARQLWrapper import SPARQLWrapper, RDF, JSON
import requests
import json

app = Flask(__name__)


ARTAPP_REPOSITORY = 'http://localhost:8080/openrdf-sesame/repositories/artApp'


@app.route('/')
def first_page():
    app.logger.debug('You arrived at ' + url_for('first_page'))
    return render_template('index.html')

@app.route('/index.html')
def index_page():
    app.logger.debug('You arrived at ' + url_for('index_page'))
    return render_template('index.html')
  
@app.route('/search.html')  
def search_page():
    app.logger.debug("you arrived at" + url_for('search_page'))
    return render_template("search.html")
  
@app.route('/map.html')  
def map_page():
    app.logger.debug("you arrived at" + url_for('map_page'))
    return render_template("map.html")

@app.route('/event.html')  
def event_page():
    app.logger.debug("you arrived at" + url_for('event_page'))
    return render_template("event.html")


@app.route('/contact.html')  
def contact_page():
    app.logger.debug("you arrived at" + url_for('contact_page'))
    return render_template("contact.html")


		
    
@app.route('/show',methods=['GET'])
def show_message():
    app.logger.debug('You arrived at ' + url_for('show_message'))
    app.logger.debug('I received the following arguments' + str(request.args) )
    
    # Get the message from the GET request, if nothing is found, set a default message.
    message = request.args.get('message', 'No message sent!')
    
    return render_template('message.html', message=message)
    
@app.route('/sparql', methods=['GET'])
def sparql():
    app.logger.debug('You arrived at ' + url_for('sparql'))
    app.logger.debug('I received the following arguments' + str(request.args) )
    
    endpoint = request.args.get('endpoint', None)
    query = request.args.get('query', None)
    
    return_format = request.args.get('format','JSON')
    app.logger.debug(return_format)
    
    if endpoint and query :
        sparql = SPARQLWrapper(endpoint)
        
        sparql.setQuery(query)
        
        if return_format == 'RDF':
            sparql.setReturnFormat(RDF)
            sparql.addCustomParameter('Accept','application/sparql-results+xml')

        else :
            sparql.setReturnFormat('JSON')
            sparql.addCustomParameter('Accept','application/sparql-results+json')
        
        app.logger.debug('Query:\n{}'.format(query))
        
        app.logger.debug('Querying endpoint {}'.format(endpoint))
        
        try :
            response = sparql.query().convert()
            app.logger.debug('Results were returned, yay!')
            
            app.logger.debug(response)
            
            if return_format == 'RDF':
                app.logger.debug('Serializing to Turtle format')
                app.logger.debug(response)
                return response.serialize(format='turtle')
            else :
                app.logger.debug('Directly returning JSON format')
                return jsonify(response)
        except Exception as e:
            app.logger.error('Something went wrong')
            app.logger.error(e)
            return jsonify({'result': 'Error'})
            
        
    else :
        return jsonify({'result': 'Error'})
        
@app.route('/store', methods=['POST'])
def store():
    app.logger.debug('You arrived at ' + url_for('store'))
    app.logger.debug('I received the following arguments' + str(request.form) )   
    
    data = request.form['data'].encode('utf-8')
    
    url = ARTAPP_REPOSITORY + "/statements"
    headers = {'content-type': 'application/x-turtle'}
    
    app.logger.debug('Assuming your data is Turtle!!')
    app.logger.debug('Doing a POST of your data to {}'.format(url))
    response = requests.post(url, data=data, headers=headers)
    
    app.logger.debug(response.status_code)
    
    return str(response.status_code)
    
    
if __name__ == '__main__':
    app.debug = True
    app.run()